import { DiscussionCommentConnection, DiscussionConnection } from '@octokit/graphql-schema';
import * as github from '@actions/github';
import { githubClient } from "./client";
import {
    GetAnswerableDiscussionIdQuery, GetAnswerableDiscussionIdQueryVariables, GetAnswerableDiscussionId,
    GetDiscussionData, GetDiscussionDataQuery, GetDiscussionDataQueryVariables,
    GetDiscussionCountQuery, GetDiscussionCountQueryVariables, GetDiscussionCount,
    ReactionContent,
    MarkDiscussionCommentAsAnswerMutation, MarkDiscussionCommentAsAnswer,
    AddDiscussionCommentMutation, UpdateDiscussionComment, UpdateDiscussionCommentMutation, 
    AddDiscussionComment, WhoAmI, WhoAmIQuery, 
    CloseDiscussionAsResolvedMutation, CloseDiscussionAsResolved, 
    CloseDiscussionAsOutdatedMutation, CloseDiscussionAsOutdated, AddLabelToDiscussionMutation, AddLabelToDiscussion, GetLabelIdQuery, GetLabelId, AddLabelToDiscussionMutationVariables
} from "./generated/graphql";

//getting answerable discussion category id
export async function getAnswerableDiscussionCategoryID(actor: string, repoName: string): Promise<any> {
    
    const answerableCategoryID: string[] = [];
    const result = await githubClient().query<GetAnswerableDiscussionIdQuery, GetAnswerableDiscussionIdQueryVariables>({
        query: GetAnswerableDiscussionId,
        variables: {
            owner: actor,
            name: repoName
        },
    });

    if (!result.data.repository) {
        throw new Error(`Couldn't find repository id!`);
    }

    //iterate over discussion categories to get the id for answerable one
    result.data.repository.discussionCategories.edges?.forEach(element => {
        if (element?.node?.isAnswerable == true) {
            answerableCategoryID.push(element?.node?.id);
        }
    })

    if (answerableCategoryID.length === 0)
    {
        throw new Error("There are no Answerable category discussions in this repository");
    }

    return answerableCategoryID;
}

export async function getTotalDiscussionCount(actor: string, repoName: string, categoryID: string) {
    const resultCountObject = await githubClient().query<GetDiscussionCountQuery, GetDiscussionCountQueryVariables>({
        query: GetDiscussionCount,
        variables: {
            owner: actor,
            name: repoName,
            categoryId: categoryID
        },
    });

    if (resultCountObject.error)
    {
        throw new Error("Error in reading discussions count");
    }

    console.log(`Total discussion count : ${resultCountObject.data.repository?.discussions.totalCount}`);
    return resultCountObject.data.repository?.discussions.totalCount;
}

//get all unlocked discussions data
export async function getDiscussionMetaData(actor: string, repoName: string, categoryID: string,labelId: string) {
    const discussionsCount = await getTotalDiscussionCount(actor, repoName, categoryID);

    const discussions = await githubClient().query<GetDiscussionDataQuery, GetDiscussionDataQueryVariables>({
        query: GetDiscussionData,
        variables: {
            owner: actor,
            name: repoName,
            categoryID: categoryID,
            count: discussionsCount,
        },
    })

    if (discussions.error) {throw new Error("Error in retrieving discussions metadata");}

    //iterate over each discussion to process body text/comments/reactions
    await processDiscussions(discussions.data.repository?.discussions as DiscussionConnection, labelId);
   
}

export async function processDiscussions(discussions: DiscussionConnection,labelId: string) {
    discussions.edges?.map(async discussion => {
        var discussionId = discussion?.node?.id ? discussion?.node?.id : "";

        if (discussionId === "") {
            throw new Error(`Can not proceed, discussionId is null!`);
        }
        else if (!discussion?.node?.locked) {

            console.log(`\n Current discussion id: ${discussionId}`);
            console.log(`Current discussion : ${discussion?.node?.bodyText}`);

            const author = discussion?.node?.author?.login;
            console.log(`Author of this discussions is: ${author}`);

            if (discussion?.node?.answer?.bodyText) {
                console.log(`Posted answer : ${discussion?.node?.answer?.bodyText}, No action needed `);
            }
            else {
                console.log("Checking reactions on latest comment provided on discussion ");
                await processComments(discussion?.node?.comments as DiscussionCommentConnection, author || "", discussionId, labelId);
            }
        }
        else
            { 
                closeDiscussionAsResolved(discussionId);
            }
    })
}

export async function processComments(comments: DiscussionCommentConnection, author: string, discussionId: string, labelId: string) {
    comments.edges?.forEach((comment) => {
        if (comment?.node?.bodyText) {
            if (comment.node.id === "")
            {
                throw new Error("Can not proceed with Null comment Id!");
            }

            //check for the presence of keyword - @bot proposed-answer
            if ((comment?.node?.bodyText.indexOf("@bot proposed-answer") >= 0) && (comment?.node?.reactions.nodes?.length != 0)) {
                //means answer was proposed earlier, check reactions to this comment
                console.log("Propose answer keyword found at : " + comment?.node?.bodyText.indexOf("@bot proposed-answer"));

                //if reaction is - heart/thumbs up/hooray, mark comment as answered else mention osds teammember to take a look
                comment?.node?.reactions.nodes?.forEach((reaction) => {
                    console.log(`Reaction to the latest comment is : ${reaction?.content}`);
                    triggerReactionContentBasedAction(reaction?.content! as ReactionContent, comment.node?.bodyText!, discussionId, comment.node?.id!,labelId);
                })
            }

            else if ((comment?.node?.bodyText.indexOf("@bot proposed-answer") >= 0) && (comment?.node?.reactions.nodes?.length == 0)) {
                //if keyword is found but no reaction/comment received by author, remind discussion author to take a look
                const updatedAt = comment?.node?.updatedAt;
                const commentDate = new Date(updatedAt.toString());

                console.log("No reactions found");
                remindAuthorForAction(commentDate, author!, discussionId);
            }
            else if ((comment?.node?.bodyText.indexOf("Could you please take a look at the suggested answer. In absence of reply, we would be closing this discussion for staleness soon") >= 0) && (comment?.node?.reactions.nodes?.length == 0)) 
            {
                const updatedAt = comment?.node?.updatedAt;
                const commentDate = new Date(updatedAt.toString());

                console.log("Discussion author has not responded in a while, so closing the discussion");
                closeDiscussionsInAbsenceOfReaction(commentDate, author!, discussionId);
            }
            else {
                console.log("No answer proposed, no action needed ");
            }
        }
    })
}

//close discussion in absence of reaction, i.e. close stale discussions
export function closeDiscussionsInAbsenceOfReaction(commentDate: Date, author: string, discussionId: string){
    const currentDate: Date = new Date();
    const diffInMs: number = currentDate.getTime() - commentDate.getTime();
    const diffInHrs: number = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays: number = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    console.log(`current date: ${currentDate} and the comment date : ${commentDate}`);
    if ((diffInDays >= 4)) {
        const responseText = "Closing the discussion fot staleness";
        console.log("Responsetext: " + responseText);
        AddCommentToDiscussion(discussionId, responseText);
        closeDiscussionAsOutdated(discussionId);
    }
}

//remind author to take action if he has not read the answer proposed by repo maintainer 
export function remindAuthorForAction(commentDate: Date, author: string, discussionId: string) {
    const currentDate: Date = new Date();
    const diffInMs: number = currentDate.getTime() - commentDate.getTime();
    const diffInHrs: number = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays: number = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    console.log(`current date: ${currentDate} and the comment date : ${commentDate}`);
    console.log(`Answer was proposed ${diffInDays} days and ${diffInHrs} hrs ago.`);

    if ((diffInDays >= 7)) {
        const responseText = "Hey @" + author + ", Could you please take a look at the suggested answer. In absence of reply, we would be closing this discussion for staleness soon.";
        console.log("Responsetext: " + responseText);
        AddCommentToDiscussion(discussionId, responseText);
    }
}

export async function triggerReactionContentBasedAction(content: ReactionContent, bodyText: string, discussionId: string, commentId: string,labelId: string) {
    console.log("Printing content reaction :  " + content);

    if (content.length === 0)
    {
        throw new Error("Null content reaction received, can not proceed");
    }

    if ((content === ReactionContent.ThumbsUp) || (content === ReactionContent.Heart) || (content === ReactionContent.Hooray) || (content === ReactionContent.Laugh) || (content === ReactionContent.Rocket)) {
        console.log("Thumbs Up| Heart received, Marking discussion as answered");

        //remove the keyword from the comment and upate comment
        const updatedText = bodyText.replace("@bot proposed-answer", 'Answer: ');
        console.log("updated text :" + updatedText);
        await updateDiscussionComment(commentId, updatedText!);
        await  markDiscussionCommentAsAnswer(commentId);
        await closeDiscussionAsResolved(discussionId);
    }
    else if ((content === ReactionContent.ThumbsDown) || (content === ReactionContent.Confused)) {
        console.log("Thumbs down received, adding label-attention to receive further attention from OSDS Team member");
        await addLabelToDiscussion(discussionId,labelId);

    }
}

//mutation- adding label "attention" to discussion for further traction by OSDS Team
export async function addLabelToDiscussion(discussionId: string, labelId: string) {
    
    if (discussionId === "")
    {
        throw new Error("Invalid discussion id, can not proceed!");
    }

    console.log("discussion id : "+ discussionId+ "  labelid : "+ labelId);

    const result = await githubClient().mutate<AddLabelToDiscussionMutation>({
        mutation: AddLabelToDiscussion,
        variables: {
            labelableId : discussionId,
            labelIds: labelId,
        }
    });

    if (result.errors){
        throw new Error("Error in mutation of adding label to discussion, can not proceed!");
    }

    return result;
}

//mutation- marking  comment as answer for discusion
export async function markDiscussionCommentAsAnswer(commentId: string) {
    const result = await githubClient().mutate<MarkDiscussionCommentAsAnswerMutation>({
        mutation: MarkDiscussionCommentAsAnswer,
        variables: {
            commentId
        }
    });

    if (result.errors){
        throw new Error("Error in mutation of marking comment as answer, can not proceed");
    }
    return result;
}

//mutation- close discussion as resolved
export async function closeDiscussionAsResolved(discussionId: string) {
    const result = await githubClient().mutate<CloseDiscussionAsResolvedMutation>({
        mutation: CloseDiscussionAsResolved,
        variables: {
            discussionId
        }
    });

    if (result.errors){
        throw new Error("Error in retrieving result discussion id");
    }
    return result.data?.closeDiscussion?.discussion?.id;
}

//mutation- close discussion as outdated
export async function closeDiscussionAsOutdated(discussionId: string) {
    const result = await githubClient().mutate<CloseDiscussionAsOutdatedMutation>({
        mutation: CloseDiscussionAsOutdated,
        variables: {
            discussionId
        }
    });

    if(result.errors){
        throw new Error("Error in closing outdated discussion");
    }
    return result.data?.closeDiscussion?.discussion?.id;
}

//mutation- updating comment text after removal of keyword
export async function updateDiscussionComment(commentId: string, body: string)  {
    const result = await githubClient().mutate<UpdateDiscussionCommentMutation>({
        mutation: UpdateDiscussionComment,
        variables: {
            commentId,
            body
        }
    });

    if (result.errors){
        throw new Error("Error in updating discussion comment");
    }

    return result;
}

export async function AddCommentToDiscussion(discussionId: string, body: string) {
    if (discussionId === "") {
        throw new Error(`Couldn't create comment as discussionId is null!`);
    }

    console.log("discussioniD :: " + discussionId + " bodyText ::" + body);
    const result = await githubClient().mutate<AddDiscussionCommentMutation>({
        mutation: AddDiscussionComment,
        variables: {
            discussionId,
            body,
        },
    });

    if (result.errors)
    {
        throw new Error("Mutation adding comment to discussion failed with error");
    }
}

export async function whoAmI() {
    const owner = await githubClient().query<WhoAmIQuery>({
        query: WhoAmI,
        },
    );

    return owner.data.viewer.login;
}

export async function getLabelId(owner: string, repoName: string, label: string) {
    const result = await githubClient().query<GetLabelIdQuery>({
        query: GetLabelId,
        variables: {
            owner: owner,
            name: repoName,
            labelName :label
        }
        },
    );
    
    if (!result.data.repository?.label?.id) {
        throw new Error(`Couldn't find mentioned Label!`);
    }

    return result.data.repository?.label?.id;
}

async function main() {

    const owner: string = await whoAmI();
    console.log(`Owner of this repo : ${owner}`);

    const actor = github.context.actor;
    console.log(`Actor : ${actor}`);

    const repo = github.context.repo.repo;
    console.log(`Current repository : ${repo}`);

    const discussionCategoryIDList: string[] = await getAnswerableDiscussionCategoryID(actor, repo);

    const labelId: string = await getLabelId(actor, repo, "attention");
    console.log(`Label id for "attention" is  : ${labelId}`);

    // Iterate over all answerable discussion categories in repo
    for (const discussionCategoryID of discussionCategoryIDList) {
        console.log(`Iterating over discussionCategoryID : ${discussionCategoryID}`);

        //Get all unlocked discussions and iterate to check all conditions and take action
        await getDiscussionMetaData(actor, repo, discussionCategoryID, labelId);
    }
}

main();