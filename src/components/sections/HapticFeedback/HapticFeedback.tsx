import {memo, useState} from 'react';
import {
  Modal as NextModal,
  Text,
  Button,
  CSS,
} from '@nextui-org/react';
import {HapticFeedback as SDKHapticFeedback} from '../../../twa';
import {Card} from '../../main/Card';
import {Modal} from '../../main/Modal';

type Props = {
  css?: CSS;
}

/**
 * Displays functionality connected with Haptic.
 */
export const HapticFeedback = memo<Props>(function HapticFeedback(props) {
  // Create handlers for modal.
  const [open, setOpen] = useState(false);
  const {
    notificationOccurred: notif,
    impactOccurred: impact,
    selectionChanged: selection,
  } = SDKHapticFeedback;

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>HapticFeedback</Text>
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        header={'HapticFeedback'}
      >
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text css={{margin: 0}}>
            This component provides functionality connected with haptic events.
            It allows developers to emit haptic notifications to make user's
            experience much better.
          </Text>

          <Text size={18} b css={{margin: '16px 0 8px'}}>
            Notification occurred
          </Text>
          <Text>
            A method tells that a task or action has succeeded, failed, or
            produced a warning. The Telegram app may play the appropriate
            haptics based on type value passed.
          </Text>
          <Button.Group size={'sm'} css={{m: 0}}>
            <Button onClick={() => notif('error')} color={'error'}>error</Button>
            <Button onClick={() => notif('success')} color={'success'}>success</Button>
            <Button onClick={() => notif('warning')} color={'warning'}>warning</Button>
          </Button.Group>

          <Text size={18} b css={{margin: '16px 0 8px'}}>
            Selection changed
          </Text>
          <Text>
            A method tells that the user has changed a selection. The Telegram
            app may play the appropriate haptics.
          </Text>
          <Text>
            Do not use this feedback when the user makes or confirms a
            selection; use it only when the selection changes.
          </Text>
          <div>
            <Button onClick={() => selection()} size={'sm'}>Emit</Button>
          </div>

          <Text size={18} b css={{margin: '16px 0 8px'}}>
            Impact occurred
          </Text>
          <Text>
            A method tells that an impact occurred. The Telegram app may play
            the appropriate haptics based on style value passed.
          </Text>
          <Button.Group size={'sm'} css={{margin: 0}}>
            <Button onClick={() => impact('light')}>light</Button>
            <Button onClick={() => impact('medium')}>medium</Button>
            <Button onClick={() => impact('heavy')}>heavy</Button>
            <Button onClick={() => impact('rigid')}>rigid</Button>
            <Button onClick={() => impact('soft')}>soft</Button>
          </Button.Group>
        </NextModal.Body>
      </Modal>
    </>
  );
});