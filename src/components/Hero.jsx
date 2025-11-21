import { useState, useEffect } from 'react'
import ServerStatus from './ServerStatus'
import ScrollAnimation from './ScrollAnimation'

export default function Hero() {
    const [copied, setCopied] = useState(false)
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const serverIP = 'horizonserver.space'

    const words = ['Приватный', 'Дружный', 'Любимый', 'Лучший', 'Ванильный']

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentWordIndex((prev) => (prev + 1) % words.length)
                setIsAnimating(false)
            }, 500) // Wait for fade out before changing word
        }, 3000) // Change word every 3 seconds

        return () => clearInterval(interval)
    }, [])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(serverIP)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 ">
            <div className="absolute inset-0 bg-white dark:bg-neutral-950"></div>

            <div className="relative z-10 container-width section-padding">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="text-center lg:text-left">
                        <div className="space-y-6">
                            <ScrollAnimation animation="animate-fadeInUp">
                                <div className="space-y-4">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-display leading-tight">
                                        <span
                                            className={`gradient-text block transition-all duration-500 transform ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                                                }`}
                                        >
                                            {words[currentWordIndex]}
                                        </span>
                                        <span className="text-neutral-900 dark:text-white">сервер</span>
                                    </h1>
                                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-700 dark:text-neutral-300">
                                        Minecraft
                                    </div>
                                </div>
                            </ScrollAnimation>

                            <ScrollAnimation animation="animate-fadeInUp" delay={100}>
                                <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                                    Присоединяйтесь к дружному сообществу игроков! Мы создаём уютное место для творчества и общения в мире Minecraft без лишних модификаций и донатов.
                                </p>
                            </ScrollAnimation>

                            {/* Server IP */}
                            <ScrollAnimation animation="animate-fadeInUp" delay={200}>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
                                    <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-4 flex items-center space-x-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
                                        <i className="fas fa-server h-5 w-5 text-primary-600 dark:text-primary-400"></i>
                                        <span className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
                                            {serverIP}
                                        </span>
                                        <button
                                            onClick={copyToClipboard}
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 h-8 px-2"
                                        >
                                            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} h-4 w-4 mr-2`}></i>
                                            {copied ? 'Скопировано!' : 'Копировать'}
                                        </button>
                                    </div>
                                </div>
                            </ScrollAnimation>

                            {/* CTA Buttons */}
                            <ScrollAnimation animation="animate-fadeInUp" delay={300}>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start">
                                    
                                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                                        <i className="fas fa-play text-base mr-2"></i>
                                        <a href="/wiki/getting-started">Начать играть</a>
                                    </button>
                                    
                                    
                                    <button
                                        onClick={() => {
                                            const communitySection = document.getElementById('community-section')
                                            if (communitySection) {
                                                communitySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                            }
                                        }}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
                                    >
                                        <i className="fas fa-users text-base mr-2"></i>
                                        О сообществе
                                    </button>
                                </div>
                            </ScrollAnimation>

                            {/* Stats */}
                            <ScrollAnimation animation="animate-fadeInUp" delay={400}>
                                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                                    <div className="text-center">
                                        <div className="text-lg sm:text-xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400">1.21.4+</div>
                                        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Версия</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg sm:text-xl lg:text-3xl font-bold text-secondary-600 dark:text-secondary-400">0%</div>
                                        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Доната</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg sm:text-xl lg:text-3xl font-bold text-accent-600 dark:text-accent-400">24/7</div>
                                        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Online</div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>

                    {/* Right Column - Server Status Card */}
                    <ScrollAnimation animation="animate-slideInRight" delay={200} className="relative order-first lg:order-last">
                        <ServerStatus serverIP={serverIP} />
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    )
}
