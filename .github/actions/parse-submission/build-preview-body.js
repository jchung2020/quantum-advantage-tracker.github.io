const {
  PATH_LABEL,
  AUTHOR,
  SUBMISSION,
  TYPECHECK_PASSED,
  TYPECHECK_ERRORS = '',
  RUN_URL,
} = process.env;

const MAX_ERROR_CHARS = 3000;

const prettyJson = JSON.stringify(JSON.parse(SUBMISSION), null, 2);

let body;
if (TYPECHECK_PASSED === 'true') {
  body =
    `<!-- submission-preview path="${PATH_LABEL}" status="ok" -->\n` +
    `Submission verified by @${AUTHOR}. Review the parsed submission below; tick **Apply** to push it, or **Regenerate** if you fixed the issue body and want to re-parse.\n\n` +
    '```json\n' +
    `${prettyJson}\n` +
    '```\n\n' +
    '- [ ] Apply this submission (push to main)\n' +
    '- [ ] Regenerate JSON (re-parse the issue)\n';
} else {
  const errors =
    TYPECHECK_ERRORS.length > MAX_ERROR_CHARS
      ? TYPECHECK_ERRORS.slice(0, MAX_ERROR_CHARS) +
        '\n\n... (truncated, see workflow run for full output)'
      : TYPECHECK_ERRORS;
  body =
    `<!-- submission-preview path="${PATH_LABEL}" status="failed" -->\n` +
    `Submission verified by @${AUTHOR}. ❌ The parsed JSON did not pass typecheck — see the [workflow run](${RUN_URL}) for full logs.\n\n` +
    '```\n' +
    `${errors}\n` +
    '```\n\n' +
    '<details><summary>Parsed JSON</summary>\n\n' +
    '```json\n' +
    `${prettyJson}\n` +
    '```\n\n</details>\n\n' +
    'Fix the issue body, then tick **Regenerate** to retry.\n\n' +
    '- [ ] Regenerate JSON (re-parse the issue)\n';
}

process.stdout.write(body);
