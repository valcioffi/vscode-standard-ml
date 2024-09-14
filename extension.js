const vscode = require('vscode');

function updateLanguageAssociations() {
  const enableSuccessorML = vscode.workspace.getConfiguration('SML').get('successorML', false);

  // Determine the correct language id to associate with the file extensions
  const languageId = enableSuccessorML ? 'sml-successor' : 'sml';

  // Dynamically set the file association for .ml, .sml, and .cs extensions
  vscode.languages.setLanguageConfiguration(languageId, {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\]\{\}\\\|\;\:\'\"\,\<\>\.\/\?\s]+)/g
  });

  vscode.workspace.getConfiguration('files').update('associations', {
    "*.ml": languageId,
    "*.sml": languageId,
    "*.cs": languageId
  }, vscode.ConfigurationTarget.Workspace);

  // Log the association for debugging
  console.log(`Associated .ml, .sml, and .cs files with ${languageId}`);
}

// Extension activation
function activate(context) {
  // Apply the correct language association when the extension is activated
  updateLanguageAssociations();

  // Monitor configuration changes
  vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('SML.successorML')) {
      updateLanguageAssociations(); // Reapply language association when the setting changes
    }
  });
}

module.exports = {
  activate
};
