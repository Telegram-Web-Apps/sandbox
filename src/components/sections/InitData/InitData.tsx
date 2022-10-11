import {memo, useState} from 'react';
import {useInitData} from '../../../twa-react';
import {Card} from '../../main/Card';
import {
  CSS,
  Modal as NextModal,
  Text,
} from '@nextui-org/react';
import {Modal} from '../../main/Modal';
import {DataTable} from '../../DataTable';

type Props = {
  css?: CSS;
}

/**
 * Displays InitData information.
 */
export const InitData = memo<Props>(function InitData(props) {
  // Extract required information.
  const {queryId, authDate, canSendAfter, hash, startParam} = useInitData();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);

  // Lines to display.
  const lines = [
    {title: 'Auth Date', value: authDate},
    {title: 'Can send after', value: canSendAfter},
    {title: 'Hash', value: hash},
    {title: 'Query Id', value: queryId},
    {title: 'Start param', value: startParam},
  ];

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>InitData</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'InitData'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about init data parameters.
          </Text>
          <DataTable items={lines}/>
        </NextModal.Body>
      </Modal>
    </>
  );
});