'use client';

import styles from './MarkdownEditor.module.scss';

const MarkdownEditor = ({ 
  content = '',
  onChange,
  placeholder = 'Start typing your markdown here...',
  readOnly = false,
  className = ''
}) => {
  return (
    <div className={`${styles['markdown-editor']} ${className}`}>
      <div className={styles['markdown-editor__container']}>
        <div className={styles['markdown-editor__placeholder']}>
          <h2 className={styles['markdown-editor__title']}>Markdown Editor</h2>
          <p className={styles['markdown-editor__description']}>
            This is a placeholder for the markdown editor component.
          </p>
          <p className={styles['markdown-editor__info']}>
            Future implementation will include:
          </p>
          <ul className={styles['markdown-editor__features']}>
            <li>Live markdown preview</li>
            <li>Syntax highlighting</li>
            <li>Toolbar for formatting</li>
            <li>Auto-save functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;