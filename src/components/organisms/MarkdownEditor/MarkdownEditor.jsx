'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/atoms/Button/Button';
import styles from './MarkdownEditor.module.scss';
import '@mdxeditor/editor/style.css';

// Dynamic import to avoid SSR issues with MDXEditor
const MDXEditor = dynamic(
  () => import('@mdxeditor/editor').then((mod) => mod.MDXEditor),
  { ssr: false }
);


const MarkdownEditor = forwardRef(({ 
  initialValue = '',
  onChange,
  placeholder = 'Start writing your markdown...',
  className = '',
  readOnly = false,
}, ref) => {
  const [markdown, setMarkdown] = useState(initialValue);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [plugins, setPlugins] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [pluginComponents, setPluginComponents] = useState(null);

  // Load plugins on component mount
  useEffect(() => {
    import('@mdxeditor/editor').then((pluginModule) => {
      // Store plugin components for toolbar
      setPluginComponents({
        UndoRedo: pluginModule.UndoRedo,
        BoldItalicUnderlineToggles: pluginModule.BoldItalicUnderlineToggles,
        CodeToggle: pluginModule.CodeToggle,
        CreateLink: pluginModule.CreateLink,
        InsertTable: pluginModule.InsertTable,
        InsertThematicBreak: pluginModule.InsertThematicBreak,
        ListsToggle: pluginModule.ListsToggle,
        Separator: pluginModule.Separator,
        BlockTypeSelect: pluginModule.BlockTypeSelect,
        InsertCodeBlock: pluginModule.InsertCodeBlock,
        DiffSourceToggleWrapper: pluginModule.DiffSourceToggleWrapper,
      });

      const loadedPlugins = [
        pluginModule.headingsPlugin(),
        pluginModule.listsPlugin(),
        pluginModule.quotePlugin(),
        pluginModule.thematicBreakPlugin(),
        pluginModule.markdownShortcutPlugin(),
        pluginModule.linkPlugin(),
        pluginModule.linkDialogPlugin(),
        pluginModule.tablePlugin(),
        pluginModule.codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        pluginModule.codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript', html: 'HTML' } }),
        pluginModule.diffSourcePlugin({ viewMode: isPreviewMode ? 'rich-text' : 'source' }),
        pluginModule.toolbarPlugin({
          toolbarContents: () => (
            <>
              <pluginModule.DiffSourceToggleWrapper>
                <pluginModule.UndoRedo />
                <pluginModule.Separator />
                <pluginModule.BoldItalicUnderlineToggles />
                <pluginModule.CodeToggle />
                <pluginModule.Separator />
                <pluginModule.ListsToggle />
                <pluginModule.Separator />
                <pluginModule.BlockTypeSelect />
                <pluginModule.Separator />
                <pluginModule.CreateLink />
                <pluginModule.InsertTable />
                <pluginModule.InsertThematicBreak />
                <pluginModule.Separator />
                <pluginModule.InsertCodeBlock />
              </pluginModule.DiffSourceToggleWrapper>
            </>
          )
        })
      ];
      setPlugins(loadedPlugins);
    });
  }, []);

  const handleChange = (newContent) => {
    setMarkdown(newContent);
    onChange?.(newContent);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    getMarkdown: () => markdown,
    setMarkdown: (value) => {
      setMarkdown(value);
      if (editorRef) {
        editorRef.setMarkdown(value);
      }
    },
    focus: () => editorRef?.focus(),
  }));

  if (!plugins) {
    return (
      <div className={`${styles['markdown-editor']} ${styles['markdown-editor--loading']} ${className}`}>
        <div className={styles['markdown-editor__loader']}>Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`${styles['markdown-editor']} ${className}`}>
      <div className={styles['markdown-editor__header']}>
        <h3 className={styles['markdown-editor__title']}>Markdown Editor</h3>
        <Button
          variant="secondary"
          onClick={togglePreviewMode}
          className={styles['markdown-editor__toggle']}
        >
          {isPreviewMode ? 'Edit' : 'Preview'}
        </Button>
      </div>
      
      <div className={styles['markdown-editor__container']}>
        <MDXEditor
          ref={(r) => setEditorRef(r)}
          markdown={markdown}
          onChange={handleChange}
          plugins={plugins}
          readOnly={readOnly || isPreviewMode}
          placeholder={placeholder}
          contentEditableClassName={styles['markdown-editor__content']}
          className={styles['markdown-editor__mdx']}
        />
      </div>
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;