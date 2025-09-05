"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AuthDialog } from "./auth-dialog"

interface AuthProviderProps {
  children: React.ReactNode
  initialSession?: any // Pass initial session from server
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSession, setHasSession] = useState(!!initialSession)

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        // If we have an initial session, use it
        if (initialSession) {
          setHasSession(true)
          setShowAuthDialog(false)
        } else {
          // No session found, show auth dialog
          setHasSession(false)
          setShowAuthDialog(true)
        }
      } catch (error) {
        console.error("Session check failed:", error)
        setHasSession(false)
        setShowAuthDialog(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [initialSession])

  // Handle successful authentication
  const handleAuthSuccess = (session: any) => {
    setHasSession(true)
    setShowAuthDialog(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      {hasSession ? (
        children
      ) : (
        <div className="relative">
          {/* Blurred background */}
          <div className="blur-sm pointer-events-none">
            {children}
          </div>
          
          {/* Auth dialog */}
          <AuthDialog 
            open={showAuthDialog} 
            onOpenChange={(open) => {
              // Prevent closing the dialog if no session exists
              if (!hasSession) {
                return
              }
              setShowAuthDialog(open)
            }}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      )}
    </>
  )
}
