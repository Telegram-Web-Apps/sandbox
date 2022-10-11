import {memo, MouseEventHandler, useCallback} from 'react';
import {HapticFeedback} from '../../../twa';
import {Card as NextCard, CardProps, Row, useTheme} from '@nextui-org/react';
import {ChevronRightSvg} from '../../icons/ChevronRightSvg';

/**
 * Default Card which is used on main screen.
 */
export const Card = memo<CardProps>(function CardMain(props) {
  const {onClick: _onClick, children, ...rest} = props;
  const {theme} = useTheme();
  const onClick = useCallback<MouseEventHandler>(e => {
    if (typeof _onClick === 'function') {
      _onClick(e);
      HapticFeedback.impactOccurred('light');
    }
  }, [_onClick]);

  return (
    <NextCard onClick={onClick} variant={'bordered'} {...rest}>
      <NextCard.Body css={{padding: '10px 10px 10px 16px'}}>
        {_onClick === undefined ? children : (
          <Row align={'center'} justify={'space-between'}>
            {children}
            <ChevronRightSvg style={{color: theme?.colors.primary.value}}/>
          </Row>
        )}
      </NextCard.Body>
    </NextCard>
  );
});