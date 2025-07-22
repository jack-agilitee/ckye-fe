'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Button from '@/components/atoms/Button/Button';
import styles from './MarkdownEditor.module.scss';
import '@mdxeditor/editor/style.css';


const MarkdownEditor = forwardRef(({ 
  initialValue = '',
  onChange,
  placeholder = 'Start writing your markdown...',
  className = '',
  readOnly = false,
}, ref) => {
  const [markdown, setMarkdown] = useState(initialValue);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editorRef, setEditorRef] = useState(null);
  const [MDXEditorComponent, setMDXEditorComponent] = useState(null);
  const [pluginsConfig, setPluginsConfig] = useState(null);

  // Load MDXEditor and plugins on component mount
  useEffect(() => {
    import('@mdxeditor/editor').then((mod) => {
      // Create plugins configuration
      const plugins = [
        mod.headingsPlugin(),
        mod.listsPlugin(),
        mod.quotePlugin(),
        mod.thematicBreakPlugin(),
        mod.markdownShortcutPlugin(),
        mod.linkPlugin(),
        mod.linkDialogPlugin(),
        mod.tablePlugin(),
        mod.codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        mod.codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript', html: 'HTML' } }),
        mod.toolbarPlugin({
          toolbarContents: () => (
            <>
              <mod.UndoRedo />
              <mod.Separator />
              <mod.BoldItalicUnderlineToggles />
              <mod.CodeToggle />
              <mod.Separator />
              <mod.ListsToggle />
              <mod.Separator />
              <mod.BlockTypeSelect />
              <mod.Separator />
              <mod.CreateLink />
              <mod.InsertTable />
              <mod.InsertThematicBreak />
              <mod.Separator />
              <mod.InsertCodeBlock />
            </>
          )
        })
      ];
      
      setMDXEditorComponent(() => mod.MDXEditor);
      setPluginsConfig(plugins);
      setIsLoading(false);
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

  if (isLoading || !MDXEditorComponent || !pluginsConfig) {
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
        <MDXEditorComponent
          ref={(r) => setEditorRef(r)}
          markdown={markdown}
          onChange={handleChange}
          plugins={pluginsConfig}
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