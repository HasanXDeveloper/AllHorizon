import ScrollAnimation from './ScrollAnimation';

export default function Community() {
    const communityFeatures = [
        {
            icon: 'fa-heart',
            gradient: 'from-red-500 to-pink-500',
            title: 'Дружелюбная атмосфера',
            description: 'Добро пожаловать в место, где каждый игрок ценится'
        },
        {
            icon: 'fa-star',
            gradient: 'from-yellow-500 to-amber-500',
            title: 'Качественный геймплей',
            description: 'Лучший игровой опыт без лагов и багов'
        },
        {
            icon: 'fa-wand-magic-sparkles',
            gradient: 'from-purple-500 to-violet-500',
            title: 'Творческая свобода',
            description: 'Реализуйте свои идеи в мире безграничных возможностей'
        },
        {
            icon: 'fa-globe',
            gradient: 'from-cyan-500 to-blue-500',
            title: 'Международное сообщество',
            description: 'Игроки со всего мира объединяются здесь'
        }
    ]

    return (
        <section id="community-section" className="section-padding bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
            <div className="container-width">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6">
                        <i className="fas fa-users text-4xl text-white"></i>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6 text-neutral-900 dark:text-white">
                        Присоединяйтесь к <span className="gradient-text">HORIZON</span>
                    </h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                        Станьте частью дружного сообщества, где ценят креативность и взаимопомощь
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: 'fa-user-group', gradient: 'from-blue-500 to-cyan-500', title: 'Есть', subtitle: 'Активное сообщество', detail: 'игроков онлайн' },
                        { icon: 'fa-message', gradient: 'from-purple-500 to-indigo-500', title: '24/7', subtitle: 'Discord сервер', detail: 'общение и поддержка' },
                        { icon: 'fa-calendar-days', gradient: 'from-green-500 to-emerald-500', title: 'Еженедельно', subtitle: 'События', detail: 'конкурсы и активности' },
                        { icon: 'fa-trophy', gradient: 'from-amber-500 to-orange-500', title: '2+ года', subtitle: 'Опыт работы', detail: 'стабильная работа' }
                    ].map((stat, index) => (
                        <div key={index} className="relative group">
                            <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6 text-center bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="space-y-4">
                                    <div className={`inline-flex p-3 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-lg`}>
                                        <i className={`fas ${stat.icon} h-6 w-6 text-white`}></i>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{stat.title}</div>
                                        <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">{stat.subtitle}</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{stat.detail}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 mb-20">
                    {/* Left Column - Features */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            {communityFeatures.map((feature, index) => (
                                <ScrollAnimation
                                    key={index}
                                    animation="animate-slideInLeft"
                                    delay={index * 100}
                                    className="h-full"
                                >
                                    <div className="flex items-start gap-4 p-6 bg-white/50 dark:bg-neutral-800/50 rounded-2xl backdrop-blur-sm hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all duration-300 h-full">
                                        <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg flex-shrink-0`}>
                                            <i className={`fas ${feature.icon} text-2xl text-white`}></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Discord Card */}
                    
                    <div className="relative">
                        <div className="rounded-xl  bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8 h-full bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-0 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10 space-y-8 h-full flex flex-col">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                        <i className="fab fa-discord text-2xl text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                            Discord сообщество
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            Общайтесь, участвуйте в событиях и находите новых друзей
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-white/40 dark:bg-neutral-700/40 rounded-xl backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">150+</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Участников</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/40 dark:bg-neutral-700/40 rounded-xl backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">45+</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Онлайн</div>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-auto">
                                    <a
                                        href="https://discord.com/invite/vSPKYsUnyz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block">
                                        <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                                            <i className="fab fa-discord h-5 w-5 mr-2"></i>
                                            Присоединиться к Discord
                                        </button>
                                    </a>
                                    <a
                                        href="https://t.me/horizonmc"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <button className="w-full mt-7 inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white h-8 sm:h-14 px-3 sm:px-4 py-1.5 sm:py-2 text-lg">
                                            Telegram канал
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                

                {/* CTA Section */}
                <div className="text-center">
                    <div className="rounded-xl  bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-12 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5"></div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                Начните свое приключение сегодня!
                            </h3>
                            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Присоединяйтесь к нашему серверу и откройте для себя мир безграничных возможностей
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                <a
                                    href="https://discord.com/invite/vSPKYsUnyz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1">
                                    <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                                        Подать заявку
                                    </button>
                                </a>
                                <a href="/wiki/about" className="flex-1">
                                    <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                                        Изучить вики
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
