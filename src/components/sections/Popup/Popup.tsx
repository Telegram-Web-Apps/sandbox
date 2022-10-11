import {memo, useState} from 'react';
import {
  Modal as NextModal,
  Text,
  Button,
  CSS,
} from '@nextui-org/react';
import {Card} from '../../main/Card';
import {DataTable} from '../../DataTable';
import {Modal} from '../../main/Modal';
import {Popup as SDKPopup} from '../../../twa';
import {usePopupOpen} from '../../../twa-react';

type Props = {
  css?: CSS;
}

/**
 * Displays information about popup.
 */
export const Popup = memo<Props>(function Popup(props) {
  // Extract all viewport information.
  const isOpened = usePopupOpen();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);

  // Lines to display.
  const lines = [
    {title: 'Is opened', value: isOpened},
  ];

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>Popup</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'Popup'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about application's popup.
          </Text>
          <DataTable items={lines}/>
          <Button.Group>
            <Button
              color={'primary'}
              onClick={() => SDKPopup.showAlert('Here comes the test alert!')}
              disabled={isOpened}
            >
              Alert
            </Button>
            <Button
              color={'primary'}
              onClick={() => SDKPopup.showConfirm('Do you like Web Apps?')}
              disabled={isOpened}
            >
              Confirm
            </Button>
          </Button.Group>
        </NextModal.Body>
      </Modal>
    </>
  );
});