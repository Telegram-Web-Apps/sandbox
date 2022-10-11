import {memo, useState} from 'react';
import {useBackButtonVisible} from '../../../twa-react';
import {
  Modal as NextModal,
  Text,
  Button,
  CSS,
} from '@nextui-org/react';
import {Card} from '../../main/Card';
import {DataTable} from '../../DataTable';
import {Modal} from '../../main/Modal';
import {BackButton as SDKBackButton} from '../../../twa';

type Props = {
  css?: CSS;
}

/**
 * Displays information about back button.
 */
export const BackButton = memo<Props>(function BackButton(props) {
  // Extract all viewport information.
  const [isVisible] = useBackButtonVisible();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);

  // Lines to display.
  const lines = [
    {title: 'Is visible', value: isVisible},
  ];

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>BackButton</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'BackButton'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about application's back button.
          </Text>
          <DataTable items={lines}/>
          <Button.Group>
            <Button
              color={'primary'}
              onClick={() => SDKBackButton.show()}
              disabled={isVisible}
            >
              Show
            </Button>
            <Button
              color={'primary'}
              onClick={() => SDKBackButton.hide()}
              disabled={!isVisible}
            >
              Hide
            </Button>
          </Button.Group>
        </NextModal.Body>
      </Modal>
    </>
  );
});