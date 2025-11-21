import ScrollAnimation from './ScrollAnimation';

export default function Gallery() {
    const galleryItems = [
        { title: 'Эпичные постройки', description: 'Потрясающие творения наших игроков', category: 'Постройки', image: '/images/image_6.png' },
        { title: 'Совместные проекты', description: 'Игроки объединяются для создания чего-то великого', category: 'Сообщество', image: '/images/image_9.png' },
        { title: 'Красивые пейзажи', description: 'Живописные места нашего мира', category: 'Природа', image: '/images/image_10.png' },
        { title: 'Городские районы', description: 'Развитые поселения игроков', category: 'Города', image: '/images/image_4.png' },
        { title: 'Архитектурные шедевры', description: 'Впечатляющие строения', category: 'Архитектура', image: '/images/image_8.png' },
        { title: 'Природные красоты', description: 'Нетронутая природа сервера', category: 'Природа', image: '/images/image_7.png' }
    ]

    return (
        <section className="section-padding bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
            <div className="container-width">
                <div className="text-center mb-16">
                    <ScrollAnimation animation="animate-fadeInUp">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6">
                            <i className="fas fa-image text-4xl text-white"></i>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6 text-neutral-900 dark:text-white">
                            Галерея <span className="gradient-text">сервера</span>
                        </h2>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                            Откройте для себя удивительные творения игроков и красоту мира Horizon
                        </p>
                    </ScrollAnimation>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {galleryItems.map((item, index) => (
                        <ScrollAnimation
                            key={index}
                            animation="animate-scaleIn"
                            delay={index * 100}
                        >
                            <div className="group h-full">
                                <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white backdrop-blur-sm">
                                                {item.category}
                                            </span>
                                        </div>

                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                                <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>

                <div className="text-center">
                    <ScrollAnimation animation="animate-fadeInUp" delay={200}>
                        <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm border-0 shadow-xl">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Станьте частью этой красоты
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                    Создавайте свои собственные шедевры и делитесь ими с сообществом игроков Horizon
                                </p>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    )
}
