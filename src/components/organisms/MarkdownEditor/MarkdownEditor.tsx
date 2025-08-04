"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  frontmatterPlugin,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  CodeToggle,
  Separator,
  CodeMirrorEditor
} from "@mdxeditor/editor";
import { FC, RefObject } from "react";
import "@mdxeditor/editor/style.css";
import styles from './MarkdownEditor.module.scss';

interface MarkdownEditorProps {
  markdown: string;
  editorRef?: RefObject<MDXEditorMethods | null>;
  onChange?: (markdown: string) => void;
}

/**
 * A fully-featured markdown editor with toolbar and multiple plugins
 */
const MarkdownEditor: FC<MarkdownEditorProps> = ({ markdown = '', editorRef, onChange }) => {
  return (
    <div className={styles['markdown-editor']}>
      <MDXEditor
        onChange={(newMarkdown) => {
          if (onChange) {
            onChange(newMarkdown);
          }
        }}
        ref={editorRef}
        markdown={markdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin({ codeBlockEditorDescriptors: [{ priority: -10, match: (_) => true, Editor: CodeMirrorEditor }] }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              ts: 'TypeScript',
              tsx: 'TypeScript React',
              jsx: 'JavaScript React',
              css: 'CSS',
              scss: 'SCSS',
              html: 'HTML',
              json: 'JSON',
              python: 'Python',
              sql: 'SQL',
              bash: 'Bash',
              markdown: 'Markdown'
            }
          }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: markdown }),
          markdownShortcutPlugin(),
          frontmatterPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertImage />
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
              </>
            )
          })
        ]}
      />
    </div>
  );
};

export default MarkdownEditor;