import { useState, useEffect, useCallback } from 'react'

export function useBallThrow(floorOffset = 400) {
  const [balls, setBalls] = useState([])

  const GRAVITY = 0.05
  const BOUNCE_FACTOR = 0.6
  const THROW_DURATION = 3000
  const MAX_BOUNCES = 3
  const BALL_SIZE = 20

  const createBall = useCallback((startX, startY, targetX, targetY, side, floor, emojis) => {
    const id = Date.now()
    return {
      id,
      x: startX,
      y: startY,
      targetX,
      targetY,
      side,
      floor,
      emojis,
      throwStartTime: Date.now(),
      hasHitTarget: false,
      vel: { x: 0, y: 0 },
      bounceCount: 0,
      rotation: 0 // Add rotation property
    }
  }, [])

  const throwBallAtElement = useCallback(
    (rect, emojis) => {
      const side = Math.random() < 0.5 ? 'left' : 'right'
      const targetX = rect.left + rect.width / 2 + (side === 'left' ? -35 : 35)
      const targetY = rect.top + rect.height / 2
      const startX = side === 'left' ? targetX - 600 : targetX + 600
      const startY = targetY + Math.random() * 100

      const floor = targetY + floorOffset

      const newBall = createBall(startX, startY, targetX, targetY, side, floor, emojis)
      setBalls((prevBalls) => [...prevBalls, newBall])
    },
    [createBall, floorOffset]
  )

  useEffect(() => {
    const updateBalls = () => {
      setBalls((prevBalls) =>
        prevBalls
          .map((ball) => {
            if (!ball.hasHitTarget) {
              const elapsedTime = (Date.now() - ball.throwStartTime) * 40
              const progress = Math.min(elapsedTime / THROW_DURATION, 1)

              const dx = ball.targetX - ball.x
              const dy = ball.targetY - ball.y
              const midX = ball.x + dx * 0.5
              const midY = Math.min(ball.y, ball.targetY) - Math.abs(dy) * 0.5

              const t = progress
              ball.x =
                (1 - t) * ((1 - t) * ball.x + t * midX) + t * ((1 - t) * midX + t * ball.targetX)
              ball.y =
                (1 - t) * ((1 - t) * ball.y + t * midY) + t * ((1 - t) * midY + t * ball.targetY)

              if (progress >= 1) {
                ball.hasHitTarget = true
                ball.vel.x = ball.side === 'left' ? -1 : 1
                ball.vel.y = -2
              }
            } else {
              ball.vel.y += GRAVITY
              ball.x += ball.vel.x
              ball.y += ball.vel.y
              ball.rotation += 1
              if (ball.y > ball.floor - BALL_SIZE) {
                ball.y = ball.floor - BALL_SIZE
                ball.vel.y *= -BOUNCE_FACTOR
                ball.bounceCount++

                if (ball.bounceCount >= MAX_BOUNCES || Math.abs(ball.vel.y) < 0.5) {
                  return null
                }
              }

              if (ball.x < 0 || ball.x > window.innerWidth) {
                return null
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
