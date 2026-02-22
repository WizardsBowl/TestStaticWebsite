// same as UNESCAPE_MD_RE plus a space
const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;

function subscript(state, silent) {
  const max = state.posMax;
  const start = state.pos;

  const mark = '@@@@'; // 自定义标记

  if (!state.src.startsWith(mark, start)) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 * mark.length >= max) { return false; }

  state.pos = start + mark.length;
  let found = false;

  while (state.pos < max) {
    if (state.src.startsWith(mark, state.pos)) {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + mark.length === state.pos) {
    state.pos = start;
    return false;
  }

  const content = state.src.slice(start + mark.length, state.pos);

  // don't allow unescaped spaces/newlines inside
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + mark.length;

  // Earlier we checked !silent, but this implementation does not need it
  const token_so = state.push('transparent_text_open', 'span', 1);
  token_so.markup = mark;

  const token_t = state.push('text', '', 0);
  token_t.content = content.replace(UNESCAPE_RE, '$1');

  const token_sc = state.push('transparent_text_close', 'span', -1);
  token_sc.markup = mark;

  state.pos = state.posMax + mark.length;
  state.posMax = max;
  return true;
}

export default function transparent_text_plugin(md) {
  md.inline.ruler.after('emphasis', 'transparent_text', subscript);
  
  var defaultRender = md.renderer.rules.transparent_text_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.transparent_text_open = function (tokens, idx, options, env, self) {
    // Add a new `target` attribute, or replace the value of the existing one.
    tokens[idx].attrSet('class', 'transparent-text');

    // Pass the token to the default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
}