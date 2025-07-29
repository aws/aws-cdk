import { PROJECT_NUMBER } from './config';
import { Github } from './github';

export const projectIds = async (github: Github) : Promise<{
  projectId: string;
  createFieldId: string;
  updateFieldId: string;
  authorFieldId: string;
}> => {
  const projectInfo = await github.getProjectInfo(PROJECT_NUMBER);
  const projectId = projectInfo.data.repository.projectV2.id!;

  let createFieldId = undefined;
  let updateFieldId = undefined;
  let authorFieldId = undefined;
  for (const field of projectInfo.data.repository.projectV2.fields.nodes) {
    if (field.name === 'Create date') {
      createFieldId = field.id;
    }
    if (field.name === 'Update date') {
      updateFieldId = field.id;
    }
    if (field.name === 'Item author') {
      authorFieldId = field.id;
    }
  }

  if (createFieldId === undefined) {
    throw new Error('Project field "Creation date" not found');
  }

  if (updateFieldId === undefined) {
    throw new Error('Project field "Update date" not found');
  }

  if (authorFieldId === undefined) {
    throw new Error('Project field "Item author" not found');
  }

  return {
    projectId,
    createFieldId,
    updateFieldId,
    authorFieldId,
  };
};
