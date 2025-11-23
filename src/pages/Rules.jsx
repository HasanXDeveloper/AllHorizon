import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { AlertTriangle, Shield, Map as MapIcon, MessageCircle, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '../lib/utils'
import { ScrollReveal } from '../components/ScrollReveal'

export default function Rules() {
    const [location] = useLocation()

    // Handle hash navigation
    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1)
            const element = document.getElementById(id)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [location])

    const sidebarLinks = [
        { id: 'warning', label: 'Предупреждение' },
        { id: 'basic', label: 'Основные правила' },
        { id: 'game', label: 'Игровые правила' },
        { id: 'territories', label: 'Территории' },
        { id: 'pvp', label: 'Убийства' },
        { id: 'chat', label: 'Правила чата' },
        { id: 'allowed-mods', label: 'Разрешенные моды' },
        { id: 'forbidden-mods', label: 'Запрещенные моды' },
    ]

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            window.history.pushState(null, '', `#${id}`)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                    <nav className="sticky top-28 space-y-2">
                        <div className="p-6 bg-white dark:bg-[#111] rounded-xl border border-neutral-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Правила сервера</h2>
                            </div>
                            <ul className="space-y-1">
                                {sidebarLinks.map((link) => (
                                    <li key={link.id}>
                                        <button
                                            onClick={() => scrollToSection(link.id)}
                                            className="block w-full text-left p-3 rounded-lg text-sm font-medium transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Mobile Navigation (Simplified) */}
                <div className="lg:hidden mb-6">
                    <div className="p-4 bg-white dark:bg-[#111] rounded-xl border border-neutral-200 dark:border-white/5 shadow-sm">
                        <h2 className="font-semibold mb-2">Содержание</h2>
                        <div className="flex flex-wrap gap-2">
                            {sidebarLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="px-3 py-1.5 bg-neutral-100 dark:bg-[#1a1a1a] rounded-lg text-xs font-medium"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">

                        {/* Header */}
                        <ScrollReveal>
                            <div className="mb-12">
                                <h1 className="text-4xl font-bold font-display mb-6 text-neutral-900 dark:text-white">Правила сервера</h1>
                                <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Соблюдение правил помогает поддерживать дружелюбную атмосферу для всех игроков сервера.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Warning Section */}
                        <ScrollReveal delay={200}>
                            <div id="warning" className="rounded-xl border transition-all duration-200 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Предупреждение</h3>
                                        <p className="text-red-800 dark:text-red-200">
                                            Играя на сервере, вы соглашаетесь со всеми правилами сервера. Незнание правил не освобождает от ответственности.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Basic Rules */}
                        <section id="basic">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Основные правила</h2>
                                <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6">
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">Эти правила являются фундаментальными для комфортной игры всех участников.</p>
                                    <ul className="space-y-4">
                                        {[
                                            'Запрещены любые виды гриферства и вандализма.',
                                            'Запрещено использование читов, хаков и эксплойтов.',
                                            'Уважайте других игроков, избегайте конфликтов и оскорблений.',
                                            'Запрещена реклама сторонних проектов и серверов.',
                                            'Все решения администрации являются окончательными.'
                                        ].map((rule, i) => (
                                            <ScrollReveal key={i} delay={i * 100}>
                                                <li className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-neutral-700 dark:text-neutral-300">{rule}</span>
                                                </li>
                                            </ScrollReveal>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>
                        </section>

                        {/* Game Rules */}
                        <section id="game">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Игровые правила</h2>
                            </ScrollReveal>
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6 space-y-6">
                                <ScrollReveal delay={100}>
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">Следующие правила регулируют игровой процесс и основные механики.</p>
                                </ScrollReveal>

                                <ScrollReveal delay={200}><RuleItem color="red" text="Запрещен дюп (исключение: ковры, рельсы, тнт), 0-tick фермы и использование багов." punishment="блокировка" /></ScrollReveal>
                                <ScrollReveal delay={300}><RuleItem color="red" text="Запрещена продажа и покупка товаров, услуг за неигровой контент (за реальные денежные средства)." punishment="блокировка" /></ScrollReveal>
                                <ScrollReveal delay={400}><RuleItem color="green" text='Использование "буров" (что это?) разрешено, а также разрешен "Easy place mod" в моде LiteMatica.' /></ScrollReveal>
                                <ScrollReveal delay={500}><RuleItem color="orange" text="При заключении договора на основе ролевой игры с участником, необходимо ясно и четко определить обязанности и права каждой стороны." punishment="судебный иск" /></ScrollReveal>
                            </div>
                        </section>

                        {/* Territories */}
                        <section id="territories">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Территории</h2>
                            </ScrollReveal>
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6 space-y-6">
                                <ScrollReveal delay={100}>
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">Правила использования и маркировки территорий.</p>
                                </ScrollReveal>

                                <ScrollReveal delay={200}>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                                        <p className="text-neutral-700 dark:text-neutral-300">Чтобы занять территорию, нужно пометить её табличками или иным заметным способом. Территория распространяется на всю высоту мира (-64 до 320).</p>
                                    </div>
                                </ScrollReveal>
                                <ScrollReveal delay={300}><RuleItem color="red" text="Запрещено игнорировать просьбы владельца территории покинуть её (кроме публичных мест)." punishment="судебный иск" /></ScrollReveal>
                                <ScrollReveal delay={400}>
                                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg">
                                        <p className="text-neutral-700 dark:text-neutral-300">Спорные ситуации с постройками на занятых территориях разбираются индивидуально.</p>
                                    </div>
                                </ScrollReveal>
                                <ScrollReveal delay={500}><RuleItem color="orange" text="Строительство вплотную к чужим постройкам разрешено только с согласия владельца." punishment="судебный иск" /></ScrollReveal>
                                <ScrollReveal delay={600}>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                                        <p className="text-neutral-700 dark:text-neutral-300">Если вы хотите запретить посещение территории, установите информативную табличку у входа.</p>
                                    </div>
                                </ScrollReveal>
                                <ScrollReveal delay={700}>
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                                        <p className="text-neutral-700 dark:text-neutral-300"><strong>Красные зоны:</strong> Крепости в незере и грибные биомы можно занимать только для жилья. Эндер крепости и порталы — общие.</p>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </section>

                        {/* PvP */}
                        <section id="pvp">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Убийства</h2>
                            </ScrollReveal>
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6 space-y-4">
                                <ScrollReveal delay={100}>
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">Правила, связанные с PvP и взаимодействием с другими игроками.</p>
                                </ScrollReveal>
                                <ScrollReveal delay={200}><RuleItem color="red" text="Запрещено убивать игроков без причины (исключение: защита территории после предупреждения)." punishment="судебный иск" /></ScrollReveal>
                                <ScrollReveal delay={300}><RuleItem color="red" text="Запрещено PVP в общественных местах (спавн, хабы, рынок)." punishment="судебный иск" /></ScrollReveal>
                                <ScrollReveal delay={400}><RuleItem color="red" text="Запрещены убийства ради выпадения головы игрока." punishment="судебный иск" /></ScrollReveal>
                                <ScrollReveal delay={500}><RuleItem color="red" text="Запрещено убийство АФК игроков." punishment="судебный иск" /></ScrollReveal>
                            </div>
                        </section>

                        {/* Chat Rules */}
                        <section id="chat">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Правила чата</h2>
                            </ScrollReveal>
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6 space-y-4">
                                <ScrollReveal delay={100}>
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">Правила общения в игровом чате и Discord.</p>
                                </ScrollReveal>
                                <ScrollReveal delay={200}><RuleItem color="yellow" text="Не злоупотребляйте матом, капсом, флудом. Запрещена реклама." punishment="мут" /></ScrollReveal>
                                <ScrollReveal delay={300}><RuleItem color="red" text="Запрещено разжигание ненависти, угрозы и дискриминация." punishment="мут" /></ScrollReveal>
                                <ScrollReveal delay={400}><RuleItem color="red" text="Запрещено оскорбление игроков и упоминание их родителей." punishment="мут" /></ScrollReveal>
                                <ScrollReveal delay={500}><RuleItem color="yellow" text="Запрещен оффтоп в спец. каналах Discord." punishment="мут" /></ScrollReveal>
                                <ScrollReveal delay={600}><RuleItem color="red" text="Запрещено нарушать правила Discord и Twitch." punishment="мут" /></ScrollReveal>
                                <ScrollReveal delay={700}><RuleItem color="red" text="Запрещено обсуждение политики и военных конфликтов." punishment="мут 192 часа" /></ScrollReveal>
                            </div>
                        </section>

                        {/* Allowed Mods */}
                        <section id="allowed-mods">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Разрешенные моды</h2>
                            </ScrollReveal>
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6">
                                <ul className="grid md:grid-cols-1 gap-3">
                                    {[
                                        'Моды для оптимизации игры (Sodium, Iris и др.)',
                                        'Моды для улучшения GUI и биндеры',
                                        'Миникарты (без радара игроков/мобов)',
                                        'Моды для улучшения звуков и света',
                                        'Индикаторы здоровья и информации (AppleSkin и др.)',
                                        'Библиотеки для других модов',
                                        'Litematica (для просмотра схем)'
                                    ].map((mod, i) => (
                                        <ScrollReveal key={i} delay={i * 50}>
                                            <li className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-neutral-700 dark:text-neutral-300">{mod}</span>
                                            </li>
                                        </ScrollReveal>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Forbidden Mods */}
                        <section id="forbidden-mods">
                            <ScrollReveal>
                                <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Запрещенные моды</h2>
                            </ScrollReveal>
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-6">
                                <ul className="grid md:grid-cols-1 gap-3">
                                    {[
                                        'Авто-тотем модификации',
                                        'Моды-боты (Baritone, принтеры и т.д.)',
                                        'Чит-клиенты и X-Ray',
                                        'Tweakeroo',
                                        'FreeCam',
                                        'MultiConnect',
                                        'Fabric-Bedrock-Miner',
                                        'Crystal optimizer (ПвП моды)',
                                        'LiquidBounce',
                                        'FastBreak'
                                    ].map((mod, i) => (
                                        <ScrollReveal key={i} delay={i * 50}>
                                            <li className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-neutral-700 dark:text-neutral-300">{mod}</span>
                                            </li>
                                        </ScrollReveal>
                                    ))}
                                </ul>
                            </div>
                        </section>

                    </div>

                    {/* Footer CTA */}
                    <ScrollReveal delay={200}>
                        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#111] p-8 text-center space-y-6">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                        <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Есть вопросы по правилам?</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                    Если у вас есть вопросы по правилам или нужны разъяснения, обращайтесь к администрации в Discord.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="https://discord.com/invite/vSPKYsUnyz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                    >
                                        Обратиться в Discord
                                    </a>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </main>
            </div >
        </div >
    )
}

function RuleItem({ color, text, punishment }) {
    const colorClasses = {
        red: 'border-red-500 bg-red-50 dark:bg-red-950/20',
        green: 'border-green-500 bg-green-50 dark:bg-green-950/20',
        orange: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
        yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    }

    const punishmentColors = {
        red: 'text-red-600 dark:text-red-400',
        orange: 'text-orange-600 dark:text-orange-400',
    }

    // Determine punishment color based on border color if not specified, default to red for punishment text
    const pColor = punishmentColors[color] || 'text-red-600 dark:text-red-400'

    return (
        <div className={`p-4 border-l-4 ${colorClasses[color] || colorClasses.red}`}>
            <p className="text-neutral-700 dark:text-neutral-300">
                {text}
                {punishment && (
                    <span className={`font-semibold ml-1 ${pColor}`}> [{punishment}]</span>
                )}
            </p>
        </div>
    )
}
