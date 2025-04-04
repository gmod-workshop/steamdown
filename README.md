# steamdown

[![Test](https://github.com/gmod-workshop/steamdown/actions/workflows/test.yml/badge.svg)](https://github.com/gmod-workshop/steamdown/actions/workflows/test.yml)
![NPM Version](https://img.shields.io/npm/v/%40gmod-workshop%2Fsteamdown)

Convert Markdown to Steam BBCode.

## Installation

```bash
npm install @gmod-workshop/steamdown
```

## Usage

```typescript
import { Converter } from '@gmod-workshop/steamdown';

const converter = new Converter();
const bbcode = await converter.convert('paragraph');
```


## Features

**Supported Markdown Syntax**

- Paragraph
- Heading
- Blockquote
- List (ordered and unordered)
- Table
- Code
- Horizontal Rule
- Emphasis
- Strong
- Link
- Image
- Strikethrough

**Partially Supported Markdown Syntax**

- Codespan
  - Inline code is not supported by Steam BBCode. 
  - Rendereded as quoted text.
  - Example: \`codespan\` -> 'codespan'
- HTML
  - HTML is not supported by Steam BBCode. Rendereded as is.
- Checkbox
  - Rendereded as a emoji checkbox.
  - Example:
    - `- [x] item` -> '✅ item'
    - `- [ ] item` -> '⬜ item'

**Unsupported Markdown Syntax**

- Autolink
- Footnote
- Definition List
- Abbreviation
- Footnote

## Reference

The following references were used to create this library. If you believe any of the information is incorrect, please open an issue.

- [Steam BBCode](https://steamcommunity.com/sharedfiles/filedetails/?id=2807121939)
