import {memo, useCallback} from 'react';
import {Modal as NextModal, ModalProps, Text} from '@nextui-org/react';
import {HapticFeedback} from '../../../twa';

type Props = ModalProps & {
  header?: string;
};

/**
 * Default modal which is used in this application.
 */
export const Modal = memo<Props>(function Modal(props) {
  const {header, css = {}, onClose: _onClose, children, ...rest} = props;
  const onClose = useCallback(() => {
    if (typeof _onClose === 'function') {
      _onClose();
    }
    HapticFeedback.impactOccurred('light');
  }, [_onClose]);

  return (
    <NextModal
      animated={false}
      blur
      noPadding
      closeButton
      fullScreen
      scroll
      onClose={onClose}
      css={{...css, borderRadius: 0}}
      {...rest}
    >
      <NextModal.Header>
        <Text b size={18}>{header}</Text>
      </NextModal.Header>
      {children}
    </NextModal>
  );
});