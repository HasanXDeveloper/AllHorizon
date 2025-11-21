import ScrollAnimation from './ScrollAnimation';

export default function Features() {
    const features = [
        {
            icon: 'fa-microchip',
            gradient: 'from-blue-500 to-cyan-500',
            title: 'Стабильность и производительность',
            description: 'Сервер работает 24/7 на мощном оборудовании с минимальными лагами',
            image: '/images/image.png',
            checks: ['99.9% аптайм', 'TPS 20.0', 'Пинг <50ms']
        },
        {
            icon: 'fa-shield-halved',
            gradient: 'from-green-500 to-emerald-500',
            title: 'Безопасность ваших построек',
            description: 'Надежная защита от гриферов и читеров с системой резервных копий',
            image: '/images/image_1.png',
            checks: ['Полная защита', 'Античит система', 'Ежедневные бэкапы']
        },
        {
            icon: 'fa-users',
            gradient: 'from-purple-500 to-pink-500',
            title: 'Дружелюбное сообщество',
            description: 'Активные игроки всегда готовы помочь и поделиться опытом',
            image: '/images/image_2.png',
            checks: ['Активные игроки', 'Discord чат', 'Совместные проекты']
        },
        {
            icon: 'fa-heart',
            gradient: 'from-red-500 to-rose-500',
            title: 'Честная игра без доната',
            description: 'Никаких платных привилегий - успех зависит только от ваших усилий',
            image: '/images/image_3.png',
            checks: ['0% P2W', 'Равные условия', 'Честность превыше всего']
        },
        {
            icon: 'fa-code',
            gradient: 'from-amber-500 to-orange-500',
            title: 'Голос игроков важен',
            description: 'Участвуйте в развитии сервера через голосования и предложения',
            image: '/images/image_11.png',
            checks: ['Система голосований', 'Открытые предложения', '80% реализации']
        },
        {
            icon: 'fa-trophy',
            gradient: 'from-indigo-500 to-purple-500',
            title: 'Профессиональная команда',
            description: 'Опытные разработчики обеспечивают стабильную работу и поддержку',
            image: '/images/image_5.png',
            checks: ['Команда 5+ человек', 'Опыт 3+ лет', 'Поддержка 24/7']
        }
    ]

    return (
        <section className="section-padding">
            <div className="container-width">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6">
                        <i className="fas fa-wand-magic-sparkles text-4xl text-white"></i>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6 text-neutral-900 dark:text-white">
                        Почему выбирают <span className="gradient-text">HORIZON</span>?
                    </h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                        Каждый аспект игрового процесса продуман для создания идеальной атмосферы
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <ScrollAnimation
                            key={index}
                            animation="animate-fadeInUp"
                            delay={index * 100}
                        >
                            <div className="group h-full">
                                <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift-subtle">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                        <div className={`absolute top-4 left-4 inline-flex items-center p-3 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg`}>
                                            <i className={`fas ${feature.icon} text-lg text-white`}></i>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            {feature.checks.map((check, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <i className="fas fa-check-circle text-base text-green-500 flex-shrink-0"></i>
                                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{check}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>

                {/* Call to Action */}
                <ScrollAnimation animation="animate-fadeInUp" delay={100}>
                    <div className="text-center">
                        <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-12 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-500/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                    Готовы испытать все эти преимущества?
                                </h3>
                                <p className="text-xl text-neutral-600 dark:text-neutral-400">
                                    Присоединяйтесь к нашему серверу и убедитесь сами в качестве игрового процесса
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">99.9%</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Аптайм</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">10+</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Игроков</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2+</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Года работы</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">0%</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">P2W</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    )
}
