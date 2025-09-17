import { ValidationRule } from 'aws-cdk-lib/core/lib/helpers-internal';

/**
 * Guardrail action when a sensitive entity is detected.
 */
export enum GuardrailAction {
  /**
   * If sensitive information is detected in the prompt or response, the guardrail
   * blocks all the content and returns a message that you configure.
   */
  BLOCK = 'BLOCK',
  /**
   * If sensitive information is detected in the model response, the guardrail masks
   * it with an identifier, the sensitive information is masked and replaced with
   * identifier tags (for example: [NAME-1], [NAME-2], [EMAIL-1], etc.).
   */
  ANONYMIZE = 'ANONYMIZE',
  /**
   * Do not take any action.
   */
  NONE = 'NONE',
}

/******************************************************************************
 *                             TIER CONFIG
*****************************************************************************/
export enum TierConfig {
  /**
   * Provides established guardrails functionality supporting English, French, and Spanish languages.
   */
  CLASSIC = 'CLASSIC',
  /**
   * Provides a more robust solution than the CLASSIC tier and has more comprehensive language support. This tier requires that your guardrail use cross-Region inference.
   */
  STANDARD = 'STANDARD',
}

/******************************************************************************
 *                             CONTENT FILTERS
 *****************************************************************************/
/**
 * The strength of the content filter. As you increase the filter strength,
 * the likelihood of filtering harmful content increases and the probability
 * of seeing harmful content in your application reduces.
 */
export enum ContentFilterStrength {
  /**
   * No content filtering applied.
   */
  NONE = 'NONE',
  /**
   * Low strength content filtering - minimal filtering of harmful content.
   */
  LOW = 'LOW',
  /**
   * Medium strength content filtering - balanced filtering of harmful content.
   */
  MEDIUM = 'MEDIUM',
  /**
   * High strength content filtering - aggressive filtering of harmful content.
   */
  HIGH = 'HIGH',
}

/**
 * The type of modality that can be used in content filters.
 */
export enum ModalityType {
  /**
   * Text modality for content filters.
   */
  TEXT = 'TEXT',
  /**
   * Image modality for content filters.
   */
  IMAGE = 'IMAGE',
}

/**
 * The type of harmful category usable in a content filter.
 */
export enum ContentFilterType {
  /**
   * Describes input prompts and model responses that indicates sexual interest, activity,
   * or arousal using direct or indirect references to body parts, physical traits, or sex.
   */
  SEXUAL = 'SEXUAL',
  /**
   * Describes input prompts and model responses that includes glorification of or threats
   * to inflict physical pain, hurt, or injury toward a person, group or thing.
   */
  VIOLENCE = 'VIOLENCE',
  /**
   * Describes input prompts and model responses that discriminate, criticize, insult,
   * denounce, or dehumanize a person or group on the basis of an identity (such as race,
   * ethnicity, gender, religion, sexual orientation, ability, and national origin).
   */
  HATE = 'HATE',
  /**
   * Describes input prompts and model responses that includes demeaning, humiliating,
   * mocking, insulting, or belittling language. This type of language is also labeled
   * as bullying.
   */
  INSULTS = 'INSULTS',
  /**
   * Describes input prompts and model responses that seeks or provides information
   * about engaging in misconduct activity, or harming, defrauding, or taking advantage
   * of a person, group or institution.
   */
  MISCONDUCT = 'MISCONDUCT',
  /**
   * Enable to detect and block user inputs attempting to override system instructions.
   * To avoid misclassifying system prompts as a prompt attack and ensure that the filters
   * are selectively applied to user inputs, use input tagging.
   */
  PROMPT_ATTACK = 'PROMPT_ATTACK',
}

/**
 * Interface to declare a content filter.
 */
export interface ContentFilter {
  /**
   * The type of harmful category that the content filter is applied to
   */
  readonly type: ContentFilterType;
  /**
   * The strength of the content filter to apply to prompts / user input.
   */
  readonly inputStrength: ContentFilterStrength;
  /**
   * The strength of the content filter to apply to model responses.
   */
  readonly outputStrength: ContentFilterStrength;
  /**
   * The action to take when content is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the content filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when content is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the content filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;
  /**
   * The input modalities to apply the content filter to.
   * @default undefined - Applies to text modality
   */
  readonly inputModalities?: ModalityType[];
  /**
   * The output modalities to apply the content filter to.
   * @default undefined - Applies to text modality
   */
  readonly outputModalities?: ModalityType[];
}

/******************************************************************************
   *                              TOPIC FILTERS
   *****************************************************************************/
/**
 * Interface for creating a custom Topic
 */
export interface CustomTopicProps {
  /**
   * The name of the topic to deny.
   */
  readonly name: string;
  /**
   * Provide a clear definition to detect and block user inputs and FM responses
   * that fall into this topic. Avoid starting with "don't".
   * @example `Investment advice refers to inquiries, guidance, or recommendations
   * regarding the management or allocation of funds or assets with the goal of
   * generating returns or achieving specific financial objectives.`
   */
  readonly definition: string;
  /**
   * Representative phrases that refer to the topic. These phrases can represent
   * a user input or a model response. Add between 1 and 100 phrases, up to 100 characters
   * each.
   * @example "Where should I invest my money?"
   */
  readonly examples: string[];
  /**
   * The action to take when a topic is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the topic filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when a topic is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the topic filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;
}

/**
 * Represents predefined topics that can be used to filter content.
 */
export class Topic {
  /**
   * Filter for financial advice and investment recommendations.
   */
  public static readonly FINANCIAL_ADVICE = new Topic({
    name: 'Financial_Advice',
    definition:
        "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
    examples: [
      'Can you suggest some good stocks to invest in right now?',
      "What's the best way to save for retirement?",
      'Should I put my money in a high-risk investment?',
      'How can I maximize my returns on investments?',
      'Is it a good time to buy real estate?',
    ],
    inputAction: GuardrailAction.BLOCK,
    inputEnabled: true,
    outputAction: GuardrailAction.BLOCK,
    outputEnabled: true,
  });

  /**
   * Filter for inappropriate or explicit content.
   */
  public static readonly INAPPROPRIATE_CONTENT = new Topic({
    name: 'Inappropriate_Content',
    definition:
        'Conversations that express views, opinions, or endorsements related to political parties, political ideologies, elections, or political figures.',
    examples: [
      "What's your stance on the current government policies?",
      'Do you support party X or Y in the upcoming election?',
      'Can you tell me which political party is better?',
      'What do you think about the new policy introduced by the president?',
      'Should I vote for this candidate?',
    ],
    inputAction: GuardrailAction.BLOCK,
    inputEnabled: true,
    outputAction: GuardrailAction.BLOCK,
    outputEnabled: true,
  });

  /**
   * Filter for legal advice and recommendations.
   */
  public static readonly LEGAL_ADVICE = new Topic({
    name: 'Legal_Advice',
    definition:
        'Providing recommendations, diagnosis, treatment options, or guidance on medical conditions, symptoms, medications, or health-related issues.',
    examples: [
      'What should I do to treat a persistent cough?',
      'Can you recommend some medication for my headache?',
      'What are the symptoms of a specific medical condition?',
      'Is this drug effective for treating my illness?',
      "Do I need to see a doctor for this pain I'm experiencing?",
    ],
    inputAction: GuardrailAction.BLOCK,
    inputEnabled: true,
    outputAction: GuardrailAction.BLOCK,
    outputEnabled: true,
  });

  /**
   * Filter for medical advice and health recommendations.
   */
  public static readonly MEDICAL_ADVICE = new Topic({
    name: 'Medical_Advice',
    definition:
        'Any discussions or references that include hate speech, discriminatory remarks, sexual content, or explicit language.',
    examples: [
      'Why are people from X country so [discriminatory remark]?',
      'Can you tell me a dirty joke?',
      '[Use of explicit language]',
      'This service is as bad as [hate speech].',
      'Do you have any adult content or products?',
    ],
    inputAction: GuardrailAction.BLOCK,
    inputEnabled: true,
    outputAction: GuardrailAction.BLOCK,
    outputEnabled: true,
  });

  /**
   * Filter for political advice and recommendations.
   */
  public static readonly POLITICAL_ADVICE = new Topic({
    name: 'Political_Advice',
    definition:
        'Offering guidance or suggestions on legal matters, legal actions, interpretation of laws, or legal rights and responsibilities.',
    examples: [
      'Can I sue someone for this?',
      'What are my legal rights in this situation?',
      'Is this action against the law?',
      'What should I do to file a legal complaint?',
      'Can you explain this law to me?',
    ],
    inputAction: GuardrailAction.BLOCK,
    inputEnabled: true,
    outputAction: GuardrailAction.BLOCK,
    outputEnabled: true,
  });

  /**
   * Create a custom topic filter.
   * @param props Properties for the custom topic filter
   */
  public static custom(props: CustomTopicProps): Topic {
    return new Topic(props);
  }

  /**
   * The name of the topic to deny.
   */
  readonly name: string;
  /**
   * Definition of the topic.
   */
  readonly definition: string;
  /**
   * Representative phrases that refer to the topic.
   */
  readonly examples?: string[];
  /**
   * The action to take when a topic is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the topic filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when a topic is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the topic filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;

  protected constructor(props: CustomTopicProps) {
    // Validate examples field constraints
    const examplesValidationRules: ValidationRule<CustomTopicProps>[] = [
      {
        condition: (p) => !p.examples || p.examples.length < 1,
        message: () => 'examples field must contain at least 1 example',
      },
      {
        condition: (p) => p.examples && p.examples.length > 100,
        message: () => 'examples field cannot contain more than 100 examples',
      },
    ];

    // Note: We can't use validateAllProps here since we don't have a Construct scope
    // Instead, we'll validate directly
    for (const rule of examplesValidationRules) {
      if (rule.condition(props)) {
        throw new Error(rule.message(props));
      }
    }

    this.name = props.name;
    this.definition = props.definition;
    this.examples = props.examples;
    this.inputAction = props.inputAction;
    this.inputEnabled = props.inputEnabled;
    this.outputAction = props.outputAction;
    this.outputEnabled = props.outputEnabled;
  }
}

/******************************************************************************
   *                               WORD FILTERS
   *****************************************************************************/
/**
 * Interface to define a Word Filter.
 */
export interface WordFilter {
  /**
   * The text to filter.
   */
  readonly text: string;
  /**
   * The action to take when a word is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the word filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when a word is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the word filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;
}

/**
 * Managed word list filter types supported by Amazon Bedrock.
 */
export enum ManagedWordFilterType {
  /**
   * Filter for profanity and explicit language.
   */
  PROFANITY = 'PROFANITY',
}

/**
 * Interface for managed word list filters.
 */
export interface ManagedWordFilter {
  /**
   * The type of managed word filter.
   * @default ManagedWordFilterType.PROFANITY
   */
  readonly type?: ManagedWordFilterType;
  /**
   * The action to take when a managed word is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the managed word filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when a managed word is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the managed word filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;
}

/******************************************************************************
   *                   SENSITIVE INFORMATION FILTERS - PII
   *****************************************************************************/
/**
 * Abstract base class for all PII types.
 */
export abstract class PIIType {
  /**
   * The string value of the PII type.
   */
  public readonly value: string;

  /**
   * The string value of the PII type.
   */
  protected constructor(value: string) {
    this.value = value;
  }

  /**
   * Returns the string representation of the PII type.
   * @returns The string value of the PII type.
   */
  toString(): string { return this.value; }
}

/**
 * Types of PII that are general, and not domain-specific.
 */
export class GeneralPIIType extends PIIType {
  /**
   * A physical address, such as "100 Main Street, Anytown, USA" or "Suite #12,
   * Building 123". An address can include information such as the street, building,
   * location, city, state, country, county, zip code, precinct, and neighborhood.
   */
  public static readonly ADDRESS = new GeneralPIIType('ADDRESS');
  /**
   * An individual's age, including the quantity and unit of time.
   */
  public static readonly AGE = new GeneralPIIType('AGE');
  /**
   * The number assigned to a driver's license, which is an official document
   * permitting an individual to operate one or more motorized vehicles on a
   * public road. A driver's license number consists of alphanumeric characters.
   */
  public static readonly DRIVER_ID = new GeneralPIIType('DRIVER_ID');
  /**
   * An email address, such as marymajor@email.com.
   */
  public static readonly EMAIL = new GeneralPIIType('EMAIL');
  /**
   * A license plate for a vehicle is issued by the state or country where the
   * vehicle is registered. The format for passenger vehicles is typically five
   * to eight digits, consisting of upper-case letters and numbers. The format
   * varies depending on the location of the issuing state or country.
   */
  public static readonly LICENSE_PLATE = new GeneralPIIType('LICENSE_PLATE');
  /**
   * An individual's name. This entity type does not include titles, such as Dr.,
   *  Mr., Mrs., or Miss.
   */
  public static readonly NAME = new GeneralPIIType('NAME');
  /**
   * An alphanumeric string that is used as a password, such as "*very20special#pass*".
   */
  public static readonly PASSWORD = new GeneralPIIType('PASSWORD');
  /**
   * A phone number. This entity type also includes fax and pager numbers.
   */
  public static readonly PHONE = new GeneralPIIType('PHONE');
  /**
   * A user name that identifies an account, such as a login name, screen name,
   * nick name, or handle.
   */
  public static readonly USERNAME = new GeneralPIIType('USERNAME');
  /**
   * A Vehicle Identification Number (VIN) uniquely identifies a vehicle. VIN
   * content and format are defined in the ISO 3779 specification. Each country
   * has specific codes and formats for VINs.
   */
  public static readonly VEHICLE_IDENTIFICATION_NUMBER = new GeneralPIIType('VEHICLE_IDENTIFICATION_NUMBER');

  private constructor(value: string) { super(value); }
}

/**
 * Types of PII in the domain of Finance.
 */
export class FinancePIIType extends PIIType {
  /**
   * A three-digit card verification code (CVV) that is present on VISA, MasterCard,
   * and Discover credit and debit cards. For American Express credit or debit cards,
   * the CVV is a four-digit numeric code.
   */
  public static readonly CREDIT_DEBIT_CARD_CVV = new FinancePIIType('CREDIT_DEBIT_CARD_CVV');
  /**
   * The expiration date for a credit or debit card. This number is usually four digits
   * long and is often formatted as month/year or MM/YY. Guardrails recognizes expiration
   * dates such as 01/21, 01/2021, and Jan 2021.
   */
  public static readonly CREDIT_DEBIT_CARD_EXPIRY = new FinancePIIType('CREDIT_DEBIT_CARD_EXPIRY');
  /**
   * The number for a credit or debit card. These numbers can vary from 13 to 16 digits
   * in length.
   */
  public static readonly CREDIT_DEBIT_CARD_NUMBER = new FinancePIIType('CREDIT_DEBIT_CARD_NUMBER');
  /**
   * A four-digit personal identification number (PIN) with which you can access your
   * bank account.
   */
  public static readonly PIN = new FinancePIIType('PIN');
  /**
   * A SWIFT code is a standard format of Bank Identifier Code (BIC) used to specify a
   * particular bank or branch. Banks use these codes for money transfers such as
   * international wire transfers. SWIFT codes consist of eight or 11 characters.
   */
  public static readonly SWIFT_CODE = new FinancePIIType('SWIFT_CODE');
  /**
   * An International Bank Account Number (IBAN). It has specific formats in each country.
   */
  public static readonly INTERNATIONAL_BANK_ACCOUNT_NUMBER = new FinancePIIType('INTERNATIONAL_BANK_ACCOUNT_NUMBER');

  private constructor(value: string) { super(value); }
}

/**
 * Types of PII in the domain of IT (Information Technology).
 */
export class InformationTechnologyPIIType extends PIIType {
  /**
   * A web address, such as www.example.com.
   */
  public static readonly URL = new InformationTechnologyPIIType('URL');
  /**
   * An IPv4 address, such as 198.51.100.0.
   */
  public static readonly IP_ADDRESS = new InformationTechnologyPIIType('IP_ADDRESS');
  /**
   * A media access control (MAC) address assigned to a network interface.
   */
  public static readonly MAC_ADDRESS = new InformationTechnologyPIIType('MAC_ADDRESS');
  /**
   * A unique identifier that's associated with a secret access key. You use
   * the access key ID and secret access key to sign programmatic AWS requests
   * cryptographically.
   */
  public static readonly AWS_ACCESS_KEY = new InformationTechnologyPIIType('AWS_ACCESS_KEY');
  /**
   * A unique identifier that's associated with a secret access key. You use
   * the access key ID and secret access key to sign programmatic AWS requests
   * cryptographically.
   */
  public static readonly AWS_SECRET_KEY = new InformationTechnologyPIIType('AWS_SECRET_KEY');

  private constructor(value: string) { super(value); }
}

/**
 * Types of PII specific to the USA.
 */
export class USASpecificPIIType extends PIIType {
  /**
   * A US bank account number, which is typically 10 to 12 digits long.
   */
  public static readonly US_BANK_ACCOUNT_NUMBER = new USASpecificPIIType('US_BANK_ACCOUNT_NUMBER');
  /**
   * A US bank account routing number. These are typically nine digits long.
   */
  public static readonly US_BANK_ROUTING_NUMBER = new USASpecificPIIType('US_BANK_ROUTING_NUMBER');
  /**
   * A US Individual Taxpayer Identification Number (ITIN) is a nine-digit number
   * that starts with a "9" and contain a "7" or "8" as the fourth digit.
   */
  public static readonly US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER = new USASpecificPIIType('US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER');
  /**
   * A US passport number. Passport numbers range from six to nine alphanumeric characters.
   */
  public static readonly US_PASSPORT_NUMBER = new USASpecificPIIType('US_PASSPORT_NUMBER');
  /**
   * A US Social Security Number (SSN) is a nine-digit number that is issued to US citizens,
   * permanent residents, and temporary working residents.
   */
  public static readonly US_SOCIAL_SECURITY_NUMBER = new USASpecificPIIType('US_SOCIAL_SECURITY_NUMBER');

  private constructor(value: string) { super(value); }
}

/**
 * Types of PII specific to Canada.
 */
export class CanadaSpecificPIIType extends PIIType {
  /**
   * A Canadian Health Service Number is a 10-digit unique identifier,
   * required for individuals to access healthcare benefits.
   */
  public static readonly CA_HEALTH_NUMBER = new CanadaSpecificPIIType('CA_HEALTH_NUMBER');
  /**
   * A Canadian Social Insurance Number (SIN) is a nine-digit unique identifier,
   * required for individuals to access government programs and benefits.
   */
  public static readonly CA_SOCIAL_INSURANCE_NUMBER = new CanadaSpecificPIIType('CA_SOCIAL_INSURANCE_NUMBER');

  private constructor(value: string) { super(value); }
}

/**
 * Types of PII specific to the United Kingdom (UK).
 */
export class UKSpecificPIIType extends PIIType {
  /**
   * A UK National Health Service Number is a 10-17 digit number, such as 485 777 3456.
   */
  public static readonly UK_NATIONAL_HEALTH_SERVICE_NUMBER = new UKSpecificPIIType('UK_NATIONAL_HEALTH_SERVICE_NUMBER');
  /**
   * A UK National Insurance Number (NINO) provides individuals with access to National
   * Insurance (social security) benefits. It is also used for some purposes in the UK
   * tax system.
   */
  public static readonly UK_NATIONAL_INSURANCE_NUMBER = new UKSpecificPIIType('UK_NATIONAL_INSURANCE_NUMBER');
  /**
   * A UK Unique Taxpayer Reference (UTR) is a 10-digit number that identifies a
   * taxpayer or a business.
   */
  public static readonly UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER = new UKSpecificPIIType('UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER');

  private constructor(value: string) { super(value); }
}

/**
 * Interface to define a PII Filter.
 */
export interface PIIFilter {
  /**
   * The type of PII to filter.
   */
  readonly type: PIIType;
  /**
   * The action to take when PII is detected.
   */
  readonly action: GuardrailAction;
  /**
   * The action to take when PII is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the PII filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when PII is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the PII filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;
}

/******************************************************************************
   *                  SENSITIVE INFORMATION FILTERS - REGEX
   *****************************************************************************/
/**
 * A Regular expression (regex) filter for sensitive information.
 *
 */
export interface RegexFilter {
  /**
   * The name of the regex filter.
   */
  readonly name: string;
  /**
   * The description of the regex filter.
   * @default - No description
   */
  readonly description?: string;
  /**
   * The action to take when a regex match is detected.
   */
  readonly action: GuardrailAction;
  /**
   * The action to take when a regex match is detected in the input.
   * @default GuardrailAction.BLOCK
   */
  readonly inputAction?: GuardrailAction;
  /**
   * Whether the regex filter is enabled for input.
   * @default true
   */
  readonly inputEnabled?: boolean;
  /**
   * The action to take when a regex match is detected in the output.
   * @default GuardrailAction.BLOCK
   */
  readonly outputAction?: GuardrailAction;
  /**
   * Whether the regex filter is enabled for output.
   * @default true
   */
  readonly outputEnabled?: boolean;
  /**
   * The regular expression pattern to match.
   */
  readonly pattern: string;
}

/******************************************************************************
   *                      CONTEXTUAL GROUNDING FILTERS
   *****************************************************************************/
/**
 * The type of contextual grounding filter.
 */
export enum ContextualGroundingFilterType {
  /**
   * Grounding score represents the confidence that the model response is factually
   * correct and grounded in the source. If the model response has a lower score than
   * the defined threshold, the response will be blocked and the configured blocked
   * message will be returned to the user. A higher threshold level blocks more responses.
   */
  GROUNDING = 'GROUNDING',
  /**
   * Relevance score represents the confidence that the model response is relevant
   * to the user's query. If the model response has a lower score than the defined
   * threshold, the response will be blocked and the configured blocked message will
   * be returned to the user. A higher threshold level blocks more responses.
   */
  RELEVANCE = 'RELEVANCE',
}

/**
 * Interface to define a Contextual Grounding Filter.
 */
export interface ContextualGroundingFilter {
  /**
   * The type of contextual grounding filter.
   */
  readonly type: ContextualGroundingFilterType;
  /**
   * The action to take when contextual grounding is detected.
   * @default GuardrailAction.BLOCK
   */
  readonly action?: GuardrailAction;
  /**
   * Whether the contextual grounding filter is enabled.
   * @default true
   */
  readonly enabled?: boolean;
  /**
   * The threshold for the contextual grounding filter.
   * - `0` (blocks nothing)
   * - `0.99` (blocks almost everything)
   */
  readonly threshold: number;
}
