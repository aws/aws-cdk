/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

export const DEFAULT_PARSING_PROMPT = `Transcribe the text content from an image page and output in Markdown syntax (not code blocks). Follow these steps:

1. Examine the provided page carefully.

2. Identify all elements present in the page, including headers, body text, footnotes, tables, visulizations, captions, and page numbers, etc.

3. Use markdown syntax to format your output:
    - Headings: # for main, ## for sections, ### for subsections, etc.
    - Lists: * or - for bulleted, 1. 2. 3. for numbered
    - Do not repeat yourself

4. If the element is a visulization
    - Provide a detailed description in natural language
    - Do not transcribe text in the visualization after providing the description

5. If the element is a table
    - Create a markdown table, ensuring every row has the same number of columns
    - Maintain cell alignment as closely as possible
    - Do not split a table into multiple tables
    - If a merged cell spans multiple rows or columns, place the text in the top-left cell and output ' ' for other
    - Use | for column separators, |-|-| for header row separators
    - If a cell has multiple items, list them in separate rows
    - If the table contains sub-headers, separate the sub-headers from the headers in another row

6. If the element is a paragraph
    - Transcribe each text element precisely as it appears

7. If the element is a header, footer, footnote, page number
    - Transcribe each text element precisely as it appears

Output Example:

A bar chart showing annual sales figures, with the y-axis labeled "Sales ($Million)" and the x-axis labeled "Year". The chart has bars for 2018 ($12M), 2019 ($18M), 2020 ($8M), and 2021 ($22M).
Figure 3: This chart shows annual sales in millions. The year 2020 was significantly down due to the COVID-19 pandemic.

# Annual Report

## Financial Highlights

* Revenue: $40M
* Profit: $12M
* EPS: $1.25


| | Year Ended December 31, | |
| | 2021 | 2022 |
|-|-|-|
| Cash provided by (used in): | | |
| Operating activities | $ 46,327 | $ 46,752 |
| Investing activities | (58,154) | (37,601) |
| Financing activities | 6,291 | 9,718 |

Here is the image.
`;
