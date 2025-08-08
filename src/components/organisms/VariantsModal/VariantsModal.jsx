'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/atoms/Button/Button';
import { MDXEditor, headingsPlugin, codeBlockPlugin, codeMirrorPlugin, CodeMirrorEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import styles from './VariantsModal.module.scss';

const VariantsModal = ({ 
  isOpen = false,
  onClose,
  title = 'Clade.md',
  version = 'Version 2',
  codeContent = '',
  onSetToMaster,
  onCreateExperiment
}) => {
  const modalRef = useRef(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className={styles['variants-modal']}>
      <div className={styles['variants-modal__container']} ref={modalRef}>
        <div className={styles['variants-modal__content']}>
          {/* Header */}
          <div className={styles['variants-modal__header']}>
            <div className={styles['variants-modal__header-content']}>
              <h2 className={styles['variants-modal__title']}>{title}</h2>
              <span className={styles['variants-modal__version']}>{version}</span>
            </div>
            <button 
              className={styles['variants-modal__close']}
              onClick={onClose}
              aria-label="Close modal"
            >
              <Image 
                src="/cross.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
          </div>

          {/* Divider */}
          <div className={styles['variants-modal__divider']} />

          {/* Code Block */}
          <div className={styles['variants-modal__code-block']}>
            <MDXEditor
              markdown={codeContent}
              readOnly
              plugins={[
                headingsPlugin(),
                codeBlockPlugin({ 
                  codeBlockEditorDescriptors: [
                    { 
                      priority: -10, 
                      match: (_) => true, 
                      Editor: CodeMirrorEditor 
                    }
                  ] 
                }),
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
                })
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles['variants-modal__actions']}>
            <button
              className={`${styles['variants-modal__button']} ${styles['variants-modal__button--secondary']}`}
              onClick={onSetToMaster}
            >
              Set to Master
            </button>
            <button
              className={`${styles['variants-modal__button']} ${styles['variants-modal__button--primary']}`}
              onClick={onCreateExperiment}
            >
              Create Experiment with Variant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantsModal;