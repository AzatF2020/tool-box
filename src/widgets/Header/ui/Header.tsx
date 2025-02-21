import { Grid, Text } from '@radix-ui/themes';
import { ArchiveIcon } from '@radix-ui/react-icons';
import style from './style.module.scss';

export default function Header() {
  return (
    <header className={style.header}>
      <div className={style.header__inner}>
        <Grid>
          <Text className={style.header__logo}>
            <ArchiveIcon className={style.header__logo__icon} />
            ToolBOX
          </Text>
        </Grid>
      </div>
    </header>
  );
}
