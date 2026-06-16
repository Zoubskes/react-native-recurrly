 ERROR  SyntaxError: C:\Users\zouba\Desktop\React_Native\react_native-recurrly\app\(tabs)\index.tsx: Unexpected token (23:40)

  21 |       <Link href="/subscriptions/spotify">Spotify Subscription</Link>
  22 |
> 23 |       <Link href={{"/subscriptions/[id]",
     |                                         ^
  24 |             params: { id: "claude" },
  25 |               }}
  26 |               >
    at constructor (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:365:19)
    at TypeScriptParserMixin.raise (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:6616:19)
    at TypeScriptParserMixin.unexpected (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:6636:16)
    at TypeScriptParserMixin.parseObjPropValue (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11996:21)
    at TypeScriptParserMixin.parseObjPropValue (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:9761:18)
    at TypeScriptParserMixin.parsePropertyDefinition (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11932:17)
    at TypeScriptParserMixin.parseObjectLike (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11849:21)
    at TypeScriptParserMixin.parseExprAtom (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11356:23)
    at TypeScriptParserMixin.parseExprAtom (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4776:20)
    at TypeScriptParserMixin.parseExprSubscripts (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11098:23)
    at TypeScriptParserMixin.parseUpdate (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11083:21)
    at TypeScriptParserMixin.parseMaybeUnary (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11063:23)
    at TypeScriptParserMixin.parseMaybeUnary (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:9854:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10916:61)
    at TypeScriptParserMixin.parseExprOps (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10921:23)
    at TypeScriptParserMixin.parseMaybeConditional (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10898:23)
    at TypeScriptParserMixin.parseMaybeAssign (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10848:21)
    at TypeScriptParserMixin.parseMaybeAssign (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:9803:20)
    at TypeScriptParserMixin.parseExpressionBase (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10801:23)
    at C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10797:39
    at TypeScriptParserMixin.allowInAnd (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:12443:12)
    at TypeScriptParserMixin.parseExpression (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10797:17)
    at TypeScriptParserMixin.jsxParseExpressionContainer (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4644:31)
    at TypeScriptParserMixin.jsxParseAttributeValue (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4616:21)
    at TypeScriptParserMixin.jsxParseAttribute (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4665:38)
    at TypeScriptParserMixin.jsxParseOpeningElementAfterName (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4679:28)
    at TypeScriptParserMixin.jsxParseOpeningElementAfterName (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10060:18)
    at TypeScriptParserMixin.jsxParseOpeningElementAt (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4674:17)
    at TypeScriptParserMixin.jsxParseElementAt (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4698:33)
    at TypeScriptParserMixin.jsxParseElementAt (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4710:32)
    at TypeScriptParserMixin.jsxParseElement (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4761:17)
    at TypeScriptParserMixin.parseExprAtom (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4771:19)
    at TypeScriptParserMixin.parseExprSubscripts (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11098:23)
    at TypeScriptParserMixin.parseUpdate (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11083:21)
    at TypeScriptParserMixin.parseMaybeUnary (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11063:23)
    at TypeScriptParserMixin.parseMaybeUnary (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:9854:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10916:61)
    at TypeScriptParserMixin.parseExprOps (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10921:23)
    at TypeScriptParserMixin.parseMaybeConditional (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10898:23)
    at TypeScriptParserMixin.parseMaybeAssign (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10848:21)
    at C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:9792:39
    at TypeScriptParserMixin.tryParse (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:6924:20)
    at TypeScriptParserMixin.parseMaybeAssign (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:9792:18)
    at C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10817:39
    at TypeScriptParserMixin.allowInAnd (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:12443:12)
    at TypeScriptParserMixin.parseMaybeAssignAllowIn (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:10817:17)
    at TypeScriptParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:12510:17)
    at TypeScriptParserMixin.parseParenAndDistinguishExpression (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11692:28)
    at TypeScriptParserMixin.parseExprAtom (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:11348:23)
    at TypeScriptParserMixin.parseExprAtom (C:\Users\zouba\Desktop\React_Native\react_native-recurrly\node_modules\@babel\parser\lib\index.js:4776:20)