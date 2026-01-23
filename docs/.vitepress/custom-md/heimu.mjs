// 此markdown-it插件用于支持黑幕文本，语法为@@text@@，渲染后效果等同于<span class="heimu">text</span>
// 使用时请确保在CSS中定义了.heimu类的样式，例如：.heimu { background-color: black; color: black; }
// 代码参考自markdown-it-sub插件，并做了相应修改

// same as UNESCAPE_MD_RE plus a space
const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;

function subscript(state, silent) {
  const max = state.posMax;
  const start = state.pos;

  const mark = '@@'; // 自定义标记

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
  const token_so = state.push('heimu_open', 'span', 1);
  token_so.markup = mark;

  const token_t = state.push('text', '', 0);
  token_t.content = content.replace(UNESCAPE_RE, '$1');

  const token_sc = state.push('heimu_close', 'span', -1);
  token_sc.markup = mark;

  state.pos = state.posMax + mark.length;
  state.posMax = max;
  return true;
}

export default function heimu_plugin(md) {
  md.inline.ruler.after('emphasis', 'heimu', subscript);
  
  var defaultRender = md.renderer.rules.heimu_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.heimu_open = function (tokens, idx, options, env, self) {
    // Add a new `target` attribute, or replace the value of the existing one.
    tokens[idx].attrSet('class', 'heimu');

    // 添加title属性以提供悬停提示
    tokens[idx].attrSet('title', '你知道的太多了');

    // Pass the token to the default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
};