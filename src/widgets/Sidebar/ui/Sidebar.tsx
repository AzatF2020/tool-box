'use client';

import { usePathname } from 'next/navigation';
import { ScrollArea } from '@radix-ui/themes';
import clsx from 'clsx';
import Link from 'next/link';
import style from './style.module.scss';

const links = [
  {
    title: 'JSON+LDE Converter',
    href: '/json-lde-converter',
  },
  {
    title: 'QR Generator',
    href: '/qr-generator',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={style.sidebar}>
      <ScrollArea scrollbars="vertical">
        {links.map(({ title, href }) => (
          <Link
            key={href}
            className={clsx(
              style.sidebar__link,
              pathname === href && style['--is-active'],
            )}
            href={href}
          >
            {title}
          </Link>
        ))}
      </ScrollArea>
    </div>
  );
}
