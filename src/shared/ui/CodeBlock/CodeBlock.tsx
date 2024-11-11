'use client';

import { memo, type ComponentProps } from 'react';
import { ErrorsComponent } from '@/shared/ui/ErrorsComponent';
import CodeEditor from '@uiw/react-textarea-code-editor';
import clsx from 'clsx';
import '@uiw/react-textarea-code-editor/dist.css';
import style from './style.module.scss';

interface ICodeBlockProps extends ComponentProps<typeof CodeEditor> {
  isValid?: boolean;
  errors?: string[];
  hasError?: boolean;
}

function CodeBlock({
  hasError = false,
  language = 'json',
  errors = [],
  ...args
}: ICodeBlockProps) {
  return (
    <div className={style.codeblock}>
      <CodeEditor
        className={clsx(
          args.className ?? style.codeblock__component,
          hasError && style['--has-error'],
        )}
        language={language}
        {...args}
      />
      <ErrorsComponent errors={errors} />
    </div>
  );
}

export default memo(CodeBlock);
