import {memo, useState} from 'react';
import {
  useViewportExpand,
  useViewportHeight, useViewportStable,
  useViewportStableHeight,
} from '../../../twa-react';
import {
  Modal as NextModal,
  Text,
  Button,
  CSS,
} from '@nextui-org/react';
import {Card} from '../../main/Card';
import {DataTable} from '../../DataTable';
import {Modal} from '../../main/Modal';

type Props = {
  css?: CSS;
}

/**
 * Displays information about current viewport.
 */
export const Viewport = memo<Props>(function Viewport(props) {
  // Extract all viewport information.
  const height = useViewportHeight();
  const stableHeight = useViewportStableHeight();
  const [isExpanded, expand] = useViewportExpand();
  const isStable = useViewportStable();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);

  // Lines to display.
  const lines = [
    {title: 'Height', value: Math.floor(height) + 'px'},
    {title: 'Stable height', value: Math.floor(stableHeight) + 'px'},
    {title: 'Expanded', value: isExpanded},
    {title: 'Stable', value: isStable},
  ];

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>Viewport</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'Viewport'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about current application
            viewport. It allows you to detect current height values, its
            stability and expansion status.
          </Text>
          <DataTable items={lines}/>
          <Button
            color={'primary'}
            onClick={() => expand()}
            disabled={isExpanded}
          >
            Expand
          </Button>
        </NextModal.Body>
      </Modal>
    </>
  );
});