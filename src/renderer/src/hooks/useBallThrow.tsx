import { useState, useEffect, useCallback } from 'react'

export function useBallThrow() {
  const [balls, setBalls] = useState([])

  const GRAVITY = 0.5
  const BOUNCE_FACTOR = 0.7
  const ANIMATION_DURATION = 400
  const MAX_BOUNCES = 4

  const createBall = useCallback((startX, startY, endX, endY, side) => {
    const id = Date.now()
    return {
      id,
      x: startX,
      y: startY,
      endX,
      endY,
      isFalling: false,
      vel: { x: 0, y: 0 },
      bounceCount: 0,
      side
    }
  }, [])

  const throwBallAtElement = useCallback(
    (event) => {
      const side: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'
      const rect = event.target.getBoundingClientRect()
      const endX = rect.left + rect.width / 2 + (side === 'left' ? -35 : +30)
      const endY = rect.top + rect.height / 2 + 400

      const startX = side === 'left' ? 0 : window.innerWidth
      const startY = Math.floor(Math.random() * (window.innerHeight / 2 - 100 + 1)) + 100

      const newBall = createBall(startX, startY, endX, endY, side)
      setBalls((prevBalls) => [...prevBalls, newBall])
    },
    [createBall]
  )

  useEffect(() => {
    const updateBalls = () => {
      setBalls((prevBalls) =>
        prevBalls
          .map((ball) => {
            if (ball.isFalling) {
              console.log(ball)
              ball.vel.y += GRAVITY
              ball.x += ball.vel.x + (ball.x < ball.endX ? 1 : -1) + (ball.side === 'left' ? -5 : 5)
              ball.y += ball.vel.y

              if (ball.y > window.innerHeight) {
                ball.y = window.innerHeight
                ball.vel.y *= -BOUNCE_FACTOR
                ball.bounceCount++

                if (ball.bounceCount >= MAX_BOUNCES || Math.abs(ball.vel.y) < 1) {
                  return null
                }
              }
            } else {
              const elapsedTime = Date.now() - ball.id
              const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1)
              console.log(progress)

              ball.x = ball.x + (ball.endX - ball.x) * progress + 1
              ball.y =
                ball.y + (ball.endY - ball.y - 150) * progress - 100 * Math.sin(Math.PI * progress)

              if (progress >= 0.6) {
                ball.isFalling = true
                ball.vel = { x: 0, y: 0 }
              }
            }
            return ball
          })
          .filter(Boolean)
      )
    }

    const animationId = requestAnimationFrame(function animate() {
      updateBalls()
      requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animationId)
  }, [])

  return { balls, throwBallAtElement }
}
