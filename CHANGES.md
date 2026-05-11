# Local Modifications

This is a personal fork of [Continue](https://github.com/continuedev/continue) with custom modifications.

See git history for details (`git diff upstream/main`).

## Changes

- Version suffix `-custom.N` to distinguish from upstream builds
- Inform users what MCP tools will do before they accept/reject: per-tool prompt templates
  in three tenses (wouldLikeTo/isCurrently/hasAlready), with optional `{{{ paramName }}}`
  interpolation from tool arguments. Configured via `toolTemplates` in MCP server config:

  ```yaml
  mcpServers:
    - name: Files MCP server
      command: node
      args: ["dist/index.js"]
      toolTemplates:
        fast_read_file:
          wouldLikeTo: 'read "{{{ path }}}"'
          isCurrently: 'reading "{{{ path }}}"'
          hasAlready: 'read "{{{ path }}}"'
        fast_edit_block:
          wouldLikeTo: 'edit "{{{ path }}}"'
          isCurrently: 'editing "{{{ path }}}"'
          hasAlready: 'edited "{{{ path }}}"'
        fast_delete_file:
          wouldLikeTo: 'delete "{{{ path }}}"'
          isCurrently: 'deleting "{{{ path }}}"'
          hasAlready: 'deleted "{{{ path }}}"'
        fast_copy_file:
          wouldLikeTo: 'copy "{{{ source }}}" to "{{{ destination }}}""'
          isCurrently: 'copying "{{{ source }}}" to "{{{ destination }}}""'
          hasAlready: 'copied "{{{ source }}}" to "{{{ destination }}}""'
  ```

- Let users easily open the file/directory being manipulated by an MCP tool.
  When `filePathArg` is set in a tool's template config,
  three action icons appear next to the path in the tool call status message:

  - 📄 Open in editor (files only; directories fall back to reveal in explorer)
  - 📂 Reveal in Explorer (files and directories)
  - ↗️ Reveal in OS file manager (files and directories)
    Configured alongside existing templates:

  ```yaml
  toolTemplates:
    fast_read_file:
      wouldLikeTo: 'read "{{{ path }}}"'
      hasAlready: 'read "{{{ path }}}"'
      filePathArg: path
  ```

- Clean up stale `yaml.schemas` entries from previous Continue extension versions.
  On activation, the extension now removes schema entries containing "continue"
  in their key (except the current version's path) before adding the new one.
  Previously, old entries accumulated indefinitely because the code only appended
  and never removed, causing "Unable to load schema" errors for uninstalled versions.
