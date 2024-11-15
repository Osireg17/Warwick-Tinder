import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Register from './page'
import { auth } from '@/lib/appwrite'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('../../../lib/appwrite', () => ({
    auth: {
        create: jest.fn(),
        createEmailPasswordSession: jest.fn()
    }
}))

jest.mock('../../../hooks/use-toast', () => ({
    useToast: jest.fn()
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe('Register Component', () => {
    const mockToast = jest.fn()
    const mockPush = jest.fn()

    beforeEach(() => {
        ; (useToast as jest.Mock).mockReturnValue({ toast: mockToast })
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders register form', () => {
        render(<Register />)
        expect(screen.getByText('Create an account')).toBeInTheDocument()
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Warwick Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    it('validates warwick email format', async () => {
        render(<Register />)
        const emailInput = screen.getByLabelText('Warwick Email')

        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
        fireEvent.submit(screen.getByRole('button', { name: /register/i }))

        await waitFor(() => {
            expect(screen.getByText('Please use your Warwick University email (@warwick.ac.uk)')).toBeInTheDocument()
        })
    })

    it('validates password requirements', async () => {
        render(<Register />)
        const passwordInput = screen.getByLabelText('Password')

        fireEvent.change(passwordInput, { target: { value: 'weak' } })
        fireEvent.submit(screen.getByRole('button', { name: /register/i }))

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
        })
    })

    it('validates password confirmation match', async () => {
        render(<Register />)
        const passwordInput = screen.getByLabelText('Password')
        const confirmPasswordInput = screen.getByLabelText('Confirm Password')

        fireEvent.change(passwordInput, { target: { value: 'StrongPass1' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass1' } })
        fireEvent.submit(screen.getByRole('button', { name: /register/i }))

        await waitFor(() => {
            expect(screen.getByText('Passwords don\'t match')).toBeInTheDocument()
        })
    })

    it('handles successful registration', async () => {
        render(<Register />)

        fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByLabelText('Warwick Email'), { target: { value: 'u1234567@live.warwick.ac.uk' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'StrongPass1' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'StrongPass1' } })

        fireEvent.submit(screen.getByRole('button', { name: /register/i }))

        await waitFor(() => {
            expect(auth.create).toHaveBeenCalled()
            expect(auth.createEmailPasswordSession).toHaveBeenCalled()
            expect(mockToast).toHaveBeenCalledWith({
                title: 'Welcome!',
                description: 'Your account has been created successfully.',
                variant: 'default',
            })
            expect(mockPush).toHaveBeenCalledWith('/questionnaire')
        })
    })
})