import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, renderHook, act, screen, cleanup } from '@testing-library/react'

import anecdoteService from './services/anecdotes'
import AnecdoteList from './components/AnecdoteList'
import { useAnecdoteActions, useAnecdotes, useAnecdoteStore } from './store'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

beforeEach(() => {
  cleanup()
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {

  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test', votes: 5 },
      { id: 2, content: 'Test2', votes: 3 }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {await result.current.initialize()})

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    expect(anecdotes.current).toEqual(mockAnecdotes)
  })

  it('anecdotes are sorted from most voted to least voted', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test', votes: 5 },
      { id: 2, content: 'Test2', votes: 3 },
      { id: 3, content: 'Test3', votes: 6 }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {await result.current.initialize()})

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    expect(anecdotes.current).toEqual([
      { id: 3, content: 'Test3', votes: 6 },
      { id: 1, content: 'Test', votes: 5 },
      { id: 2, content: 'Test2', votes: 3 }
    ])
  })

  it('AnecdoteList renders only filtered anecdotes', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test Anecdote', votes: 0 },
      { id: 2, content: 'Another test anecdote', votes: 0 },
      { id: 3, content: 'One more', votes: 0 }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: 'Test Anecdote' })

    render(<AnecdoteList />)

    await expect(screen.getByText('Test Anecdote')).toBeDefined()
    await expect(screen.queryByText('Another test anecdote')).toBeDefined()
    await expect(screen.queryByText('One more')).toBeNull()
  })

  it('voting anecdote increases votes', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test Anecdote', votes: 0 },
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes })

    render(<AnecdoteList />)

    await screen.queryByRole('button', { name: 'vote' }).click()

    await expect(screen.queryByText('has 1')).toBeDefined()
  })
})