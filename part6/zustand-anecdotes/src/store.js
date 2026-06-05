
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const sortByVotes = (anecdotes) => (
  anecdotes.sort((a, b) => b.votes - a.votes)
)

export const useNotificationStore = create((set) => ({
  notification: '',
  setNotification: text => {
    set(() => ({notification: text}))
    setTimeout(() => set(() => ({notification: ''})), 5000)
  }
}))

export const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: sortByVotes(
          state.anecdotes.map(a => a.id === id ? updated : a)
        )
      }))
    },
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes: sortByVotes(anecdotes) }))
    },
    add: async (anecdote) => {
      const res = await anecdoteService.create(anecdote)
      set(state => ({
        anecdotes: sortByVotes([...state.anecdotes, res])
      }))
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set(state => ({
        anecdotes: sortByVotes(state.anecdotes.filter(a => a.id !== id))
      }))
    },
    setFilter: value => set(() => ({ filter: value }))
  },
}))

export const useNotification = () => useNotificationStore(state => state.notification)
export const useSetNotification = () => useNotificationStore(state => state.setNotification)
export const useAnecdotes = () => useAnecdoteStore((state) => (state.anecdotes))
export const useAnecdotesFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)