import {memo, ReactNode} from 'react';
import {Checkbox, Row, Table, Text, styled} from '@nextui-org/react';

interface Props {
  items: {
    title: string;
    value: any;
  }[];
}

const ColorBox = styled('div', {
  display: 'block',
  width: 15,
  height: 15,
  marginRight: 7,
  borderRadius: '50%',
  border: '1px solid $accents2',
});

/**
 * Standard table that displays information about some component properties.
 */
export const DataTable = memo<Props>(function DataTable(props) {
  const {items} = props;

  return (
    <Table
      css={{height: 'auto', minWidth: '100%', padding: 0}}
      compact
      shadow={false}
      bordered
    >
      <Table.Header>
        <Table.Column>Property</Table.Column>
        <Table.Column>Value</Table.Column>
      </Table.Header>
      <Table.Body>
        {items.map(({title, value}, idx) => {
          let valueNode: ReactNode;

          if (typeof value === 'undefined') {
            valueNode = <Text css={{color: '$accents7'}}>unknown</Text>;
          } else if (typeof value === 'boolean') {
            valueNode = <Checkbox aria-label={title} isSelected={value}/>;
          } else if (typeof value === 'string' && value.match(/#[a-f0-9]{6}/i)) {
            valueNode = (
              <Row align={'center'}>
                <ColorBox css={{backgroundColor: value}}/>
                <Text><code>{value}</code></Text>
              </Row>
            );
          } else if (value instanceof Date) {
            valueNode = <Text><code>{value.toISOString()}</code></Text>;
          } else {
            valueNode = value;
          }

          return (
            <Table.Row key={idx}>
              <Table.Cell><b>{title}</b></Table.Cell>
              <Table.Cell>{valueNode}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
});