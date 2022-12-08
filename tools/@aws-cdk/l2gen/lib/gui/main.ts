import React, {useState, useEffect} from 'react';
import { render, Text, Box} from 'ink';
import SelectInput from 'ink-select-input';

const E = React.createElement;

const Counter = () => {
	const [counter, setCounter] = useState(0);

	useEffect(() => {
    if (counter === 10) {
      exit();
      return;
    }

    setTimeout(() => {
			setCounter(previousCounter => previousCounter + 1);
		}, 100);
	}, [counter]);

  return E(Text, {color: 'green'}, `${counter} tests passed`);
};

function Screen() {
	const [selected, setSelected] = useState('first');

	const items = [
		{
			label: 'First',
			value: 'first'
		},
		{
			label: 'Second',
			value: 'second'
		},
		{
			label: 'Third',
			value: 'third'
		}
	];

  const selectList = E(SelectInput, {
    items,
    onHighlight: (s) => setSelected(s.value),
  });
  return E(Box, {},
    selectList,
    E(Box, { borderStyle: "single" }, E(Text, {}, selected.toUpperCase())));
}

function exit() {
  clear();
  unmount();
}

const { clear, unmount } = render(E(Screen), {
  patchConsole: false,
});