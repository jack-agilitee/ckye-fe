"use client";

import { MDXEditor, MDXEditorMethods, headingsPlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles } from "@mdxeditor/editor";
import { FC } from "react";

interface MarkdownEditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MarkdownEditor: FC<MarkdownEditorProps> = ({ markdown = '', editorRef }) => {
  return (
    <MDXEditor
      onChange={(e) => console.log(e)}
      ref={editorRef}
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
            </>
          )
        })
      ]}
    />
  );
};

export default MarkdownEditor;