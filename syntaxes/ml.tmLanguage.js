
const fs = require('fs');
const path = require('path');

// --------------------- Start: Preprocessor Definition
var tmLanguage = [];
var successor_tmLanguage = [];
var repository = {};
var keywords = [];
var keywordsByType = {};
var constants = [];

var tmLanguage_last = [];

function addKeyword(keyword, type="other", isModifier=false, regex="") {
  if(regex == "")
    regex = keyword;


  tmLanguage_last.push({
    match: `\\(?\\b${regex}\\b\\)?`,
    name: type == "storage" ? `storage.${(isModifier) ? "modifier" : "type"}.${keyword}.sml` : `keyword.${type}.${keyword}.sml`
  });

  keywords.push(regex);

  if(!keywordsByType[type]) {
    keywordsByType[type] = [];
  }
  keywordsByType[type].push(regex);
}

function addKeywords(keywords, type="other", isModifier=false) {
  keywords.forEach(keyword => addKeyword(keyword, type, isModifier));
}

function addConstant(constant) {
  tmLanguage_last.push({
    match: `\\(?\\b${constant}\\b\\)?`,
    name: `constant.language.${constant}.sml`
  });
  constants.push(constant); null
};

function addConstants(constants) {
  constants.forEach(constant => addConstant(constant));
}

function addRepositoryPattern(name, pattern) {
  if(!repository[name]) {
    repository[name] = { patterns: [] };
  }
  repository[name].patterns.push(pattern);
}

function addPattern(pattern) {
  tmLanguage.push(pattern);
  successor_tmLanguage.push(pattern);
}

function addPurePattern(pattern){
  tmLanguage.push(pattern);
}

function addSuccessorPattern(pattern) {
  successor_tmLanguage.push(pattern);
}

function addKeywordPattern(match, captures){
  const mappedCaptures = captures.reduce((acc, capture, index) => {
    acc[index + 1] = { name: capture };
    return acc;
  }, {});

  addPattern({
    match: match,
    captures: mappedCaptures
  })
}
// --------------------- End: Preprocessor Definition

// --------------------- Start: Grammar Customization
// Define common patterns
const identifier_not_captured = `(?<=^|[^a-zA-Z0-9_])[a-zA-Z_'][a-zA-Z0-9_']*|\\((?<=^|[^a-zA-Z0-9_])[a-zA-Z_'][a-zA-Z0-9_']*\\)|\\(\\s*?\\)`;
const identifier = `(${identifier_not_captured})`;
const type = `(\\(?${identifier}\\)?|\\(?'*${identifier}\\)?)(\\s*(\\(?${identifier}\\)?|\\(?'*${identifier}\\)?)?)*((\\s*(\\*|->)\\s*(\\(?${identifier}\\)?(\\s*(\\(?${identifier}\\)?|\\(?'*${identifier}\\)?)?)*|\\(?'*${identifier}\\)?(\\s*(\\(?${identifier}\\)?|\\(?'*${identifier}\\)?)?)*|\\(.*?\\)))*)`;

// Priotity patterns

addSuccessorPattern({
  include: "#blockComments"
});

addSuccessorPattern({
  "match": "\\(\\*.*$",
  "name": "comment.line.other.sml"
});

addRepositoryPattern("comments",
  {
    "name": "comment.block.sml",
    "begin": "\\(\\*",
    "end": "\\*\\)",
    "patterns": [
      {
        "include": "#comments" // Self-reference for nesting
      }
    ]
  }
);

addRepositoryPattern("blockComments",
  {
    "name": "comment.block.ml",
    "begin": "\\(\\*[^)]",
    "end": "(?<!\\()\\*\\)",
    "beginCaptures": {
      "0": {
        "name": "comment.block.ml"
      }
    },
    "endCaptures": {
      "0": {
        "name": "comment.block.ml"
      }
    },
    "patterns": [
      {
        "include": "#blockComments"
      }
    ]
  }
);

addPurePattern({
  include: "#comments"
});

// Define keywords patterns
addKeywordPattern(`(raise)\\s+(${identifier})`, ["keyword.control.sml", "variable.other.constant.sml"]);
addKeywordPattern(`(handle)\\s+(${identifier})`, ["keyword.control.sml", "variable.other.constant.sml"]);
addKeywordPattern(`(of)\\s+(?:${identifier_not_captured}\\s*)*\\=\\>`,["keyword.control.sml"]);
addKeywordPattern(`(of)\\s+(${type})`,["keyword.control.sml","support.type.sml"]);
addKeywordPattern(`(open)\\s+(${identifier})`,["keyword.control.sml","support.type.sml"]);
addKeywordPattern(`(functor)\\s+(${identifier})`,["storage.type.sml","support.type.sml"]);
addPattern({
  match: `(type|eqtype)\\s+(${type})(\\s*?\\=\\s*?(${type}))?`,
  captures: {
    "1": {
      name: "storage.type.sml"
    },
    "2": {
      name: "support.type.sml"
    },
    "25": {
      name: "support.type.sml",
    }
  }
});

addKeywordPattern(`(\\bfun\\b)\\s+(${identifier})`,["storage.type.sml","entity.name.function.sml"]);
addKeywordPattern(`(datatype)\\s+(${type})`,["storage.type.sml","support.type.sml"]);
addKeywordPattern(`\\b(signature|structure)\\b\\s+(${identifier})`, ["storage.type.sml","support.type.sml"]);
addKeywordPattern(`(exception)\\s+(${identifier})`,["storage.type.sml","variable.other.constant.sml"]);
addKeywordPattern(`(:>)\\s*?(${identifier})`,["keyword.operator.sml","support.type.sml"]);
addKeywordPattern(`(?<!:)(:)\\s*?(${type})`,["keyword.operator.sml","support.type.sml"]);

// Define keywords
addKeywords(["fun", "val", "exception", "datatype", "type", "eqtype", "signature", "structure", "functor"], "storage");
addKeywords(["if", "then", "else", "and", "use", "raise", "as", "case", "let", "in", "end", "open", "handle", "of", "sig", "struct", "while", "do"], "control"); 
addKeyword("ref", "storage", true);
addKeyword("op", "storage", true);
addKeyword("fn", "other");
addKeywords(["-", "=", "<>", "<", ">", "andalso", "orelse", "@", "::", ":", ":=", ":>", "div", "mod", "andalso", "orelse", "=>", "<=", "!"], "operator");
addKeyword("^", "operator", false, "\\^");
addKeyword("+", "operator", false, "\\+");
addKeyword("*", "operator", false, "\\*");
addKeyword("/", "operator", false, "\\/");

// Define constants
addConstants(["true", "false", "not", "SOME", "NONE", "nil", "LESS", "EQUAL", "GREATER", "_"]);
tmLanguage.push(...tmLanguage_last);

// Construct the regex patterns
const keyword = `\\b(${keywords.join("|")})\\b`
const operator = `(${keywordsByType["operator"].join("|")})`;
const logicalOperator = "\\b(andalso|orelse)\\b";
const number = "\\b\\d+\\b";

// Add patterns to the repository
addPattern({
  match : `(${identifier})\\.`,
  captures: {
    "1": {
      name: "support.type.sml"
    }
  }
});

addPattern({
  match: `(?<=${keyword}\\s+)(${identifier})(?=\\s+(?:(?!${logicalOperator})(?!${keyword})${identifier}|\\d+|"(?:[^"\\\\]|\\\\.)*"|#"[^"]*"))`,
  captures: {
    "2": {

      name: "entity.name.function.sml"
    }
  }
})
addPattern({
  match: `(?<=${operator}\\s*)(${identifier})(?=\\s+(?:(?!${logicalOperator})(?!${keyword})${identifier}|\\d+|"(?:[^"\\\\]|\\\\.)*"|#"[^"]*"))`,
  captures: {
    "2": {

      name: "entity.name.function.sml"
    }
  }
})

addPattern({
  match: `(?<=^|;|,|\\#|\\)|\\()(?<!\\(\\))\\s*(?!${keyword})${identifier}(?=\\s+(?:(?!${logicalOperator})(?!${keyword})${identifier}|\\d+|"(?:[^"\\\\]|\\\\.)*"|#"[^"]*"))`,
  captures: {
    "2": {

      name: "entity.name.function.sml"
    }
  }
})


addPattern({
  match: `(${identifier})\\s*\\(`,
  name: "entity.name.function.sml"
});
addPattern({
  name: "string.quoted.double.ml",
  begin: "\"",
  end: "\"",
  patterns: [

    {
      name: "constant.character.escape.ml",
      match: "\\\\."
    }
  ]
});
addPattern({
  name: "string.quoted.single.ml",
  match: "#\"(.)\""
});
addPattern({
  match: number,
  name: "constant.numeric.sml"
});

addPattern({
  match: `\\b([A-Z][A-Z0-9_']*?[A-Z0-9_'])\\b`,
  name: "variable.other.constant.sml"
});
addPattern({
  match: `(${identifier})`,
  name: "variable.other.sml"
});
// --------------------- End: Grammar Customization

// --------------------- Start: JSON creation
// Construct the JSON structure with repository
const tmLanguageFile = {
  "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  "name": "Standard ML",
  "patterns": tmLanguage.map(({ match, name, begin, end, patterns, include, captures }) => {
    const patternObj = { match, name, begin, end, patterns, include, captures };
    // Clean up undefined properties
    Object.entries(patternObj).forEach(([key, value]) => {
      if (value === undefined) {
        delete patternObj[key];
      }
    });
    return patternObj;
  }),
  "scopeName": "source.sml",
  "repository": repository
};

const successor_tmLanguageFile = {
  "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  "name": "Successor ML",
  "patterns": successor_tmLanguage.map(({ match, name, begin, end, patterns, include, captures }) => {
    const patternObj = { match, name, begin, end, patterns, include, captures };
    // Clean up undefined properties
    Object.entries(patternObj).forEach(([key, value]) => {
      if (value === undefined) {
        delete patternObj[key];
      }
    });
    return patternObj;
  }),
  "scopeName": "source.sml", // scope is normalized afterwards
  "repository": repository
};

// Define the output file path
const outputFilePath = path.join(__dirname, 'ml.tmLanguage.json');
const successor_outputFilePath = path.join(__dirname, 'ml.successor.tmLanguage.json');

// Serialize the structure to a JSON string
const tmLanguageFileJson = JSON.stringify(tmLanguageFile, null, 2); // Pretty print with 2 spaces

const successor_tmLanguageFileJson = JSON.stringify(successor_tmLanguageFile, null, 2).replaceAll(".sml", ".sml.successor"); // Normalize scope

// Write the JSON string to the file
fs.writeFile(outputFilePath, tmLanguageFileJson, 'utf8', (err) => {
  if (err) {
    console.error("Error writing the JSON to the file:", err);
  } else {
    console.log("tmLanguage.json successfully created.");
  }
});

fs.writeFile(successor_outputFilePath, successor_tmLanguageFileJson, 'utf8', (err) => {
  if (err) {
    console.error("Error writing the Successor JSON to the file:", err);
  } else {
    console.log("Successor tmLanguage.json successfully created.");
  }
});
// --------------------- End: JSON creation