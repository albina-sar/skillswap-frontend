import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from './Combobox'

const options = [
  { value: 'Самара', label: 'Самара' },
  { value: 'Саратов', label: 'Саратов' },
]

describe('Combobox', () => {
  it('filters and selects an option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Combobox
        name="city"
        label="Город"
        value=""
        options={options}
        searchable
        onChange={onChange}
      />,
    )

    await user.click(screen.getByLabelText('Город'))
    await user.type(screen.getByLabelText('Город'), 'Сар')
    await user.click(screen.getByRole('option', { name: 'Саратов' }))

    expect(onChange).toHaveBeenCalledWith('Саратов')
  })
})
