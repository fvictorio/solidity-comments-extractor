const extractComments = require('..');

describe('extract comments', () => {
  it('should work for a line comment', () => {
    const code = `
// this is a contract
contract Foo {
}
`;
    const comments = extractComments(code);
    expect(comments).toHaveLength(1);

    const lineComment = comments[0];
    expect(lineComment.type).toEqual('LineComment');
    expect(lineComment.raw).toEqual(' this is a contract');
    expect(lineComment.value).toEqual(' this is a contract');
  });

  it('should work for a block comment', () => {
    const code = `
contract Foo {
  /* a block comment */
}
`;
    const comments = extractComments(code);
    expect(comments).toHaveLength(1);

    const blockComment = comments[0];
    expect(blockComment.type).toEqual('BlockComment');
    expect(blockComment.raw).toEqual(' a block comment ');
    expect(blockComment.value).toEqual(' a block comment');
  });

  it('should ignore comments inside double quoted strings', () => {
    const code = `
contract Foo {
  string s = "/* a block comment */";
}
`;
    const comments = extractComments(code);
    expect(comments).toHaveLength(0);
  });

  it('should ignore comments inside single quoted strings', () => {
    const code = `
contract Foo {
  string s = '/* a block comment */';
}
`;
    const comments = extractComments(code);
    expect(comments).toHaveLength(0);
  });

  it('should work for two successive block comments', () => {
    const code = `
contract Foo {
  /*1*//*2*/
}
`;
    const comments = extractComments(code);
    expect(comments).toHaveLength(2);

    const [c1, c2] = comments;
    expect(c1.type).toEqual('BlockComment');
    expect(c2.type).toEqual('BlockComment');
  });
});
