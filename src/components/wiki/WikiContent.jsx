import { useState } from 'react'
import { cn } from '../../lib/utils'
import { ScrollReveal } from '../ScrollReveal'
import {
    Terminal, Server, Shield, Users, Map as MapIcon,
    Coins, ShoppingBag, ArrowRight, Info, HelpCircle,
    Check, AlertTriangle, Search
} from 'lucide-react'

const sections = {
    'getting-started': {
        title: 'Начало игры на Horizon',
        content: (
            <div className="space-y-8">
                <ScrollReveal>
                    <section className="prose-section">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
                                <Server className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Шаг 1: Получите доступ к серверу</h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Horizon — это приватный сервер, поэтому для игры на нем вам необходимо получить доступ. Вы можете подать заявку на вступление через наш сайт или Discord-сервер.
                        </p>
                        <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2 text-neutral-900 dark:text-neutral-200">
                                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-neutral-200 text-white dark:text-black flex items-center justify-center text-xs">1</span>
                                Как подать заявку:
                            </h3>
                            <ol className="space-y-3 text-neutral-600 dark:text-neutral-400">
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                                    <span>Перейдите на <a href="/" className="text-neutral-900 dark:text-neutral-200 hover:underline font-medium">главную страницу</a> сайта или в <a href="https://discord.com/invite/vSPKYsUnyz" target="_blank" rel="noopener noreferrer" className="text-neutral-900 dark:text-neutral-200 hover:underline font-medium">Discord-сервер</a></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                                    <span>Нажмите кнопку "Подать заявку"</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                                    <span>Заполните форму, указав свой игровой ник, возраст и причину вступления</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                                    <span>Отправьте заявку и ожидайте ответа от администрации</span>
                                </li>
                            </ol>
                        </div>
                    </section>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <section className="prose-section">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
                                <Terminal className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold m-0 text-neutral-900 dark:text-neutral-200">Шаг 3: Подключитесь к серверу</h2>
                        </div>
                        <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 rounded-xl p-6 shadow-sm mb-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <Server className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                    <span className="font-mono text-lg text-neutral-900 dark:text-neutral-200">horizonserver.space</span>
                                </div>
                                <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                                    1.21.4+
                                </span>
                            </div>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-white/5 rounded-xl p-4 flex gap-3">
                            <Info className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                <strong>Совет:</strong> Вы можете скопировать IP-адрес сервера на главной странице сайта, нажав на кнопку "Скопировать IP".
                            </p>
                        </div>
                    </section>
                </ScrollReveal>
            </div>
        )
    },
    'territories': {
        title: 'Территории и регионы',
        content: (
            <div className="space-y-8">
                <ScrollReveal>
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
                                <MapIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold m-0 text-neutral-900 dark:text-neutral-200">Система территорий</h2>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                            На сервере Horizon нет автоматической системы защиты территорий (приватов). Вместо этого используется система доверия и взаимного уважения. Игроки обозначают свои территории табличками, а другие уважают эти границы.
                        </p>
                    </section>
                </ScrollReveal>

                <section>
                    <ScrollReveal delay={200}>
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">Правила использования территорий</h2>
                    </ScrollReveal>
                    <div className="grid gap-4">
                        {[
                            { title: 'Соблюдайте дистанцию', desc: 'Стройте свои постройки на расстоянии 200-300 блоков от других игроков.', icon: MapIcon },
                            { title: 'Уважайте границы', desc: 'Не стройте и не ломайте блоки на территории других игроков без разрешения.', icon: Shield },
                            { title: 'Разумные размеры', desc: 'Занимайте только ту территорию, которую реально используете.', icon: Check },
                            { title: 'Нет гриферству', desc: 'Любое разрушение чужих построек строго наказывается баном.', icon: AlertTriangle, color: 'text-red-500' },
                        ].map((item, i) => (
                            <ScrollReveal key={i} delay={i * 100}>
                                <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 h-full">
                                    <div className={`p-2 rounded-lg h-fit ${item.color ? 'bg-red-500/10 ' + item.color : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200'}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold mb-1 ${item.color || 'text-neutral-900 dark:text-neutral-200'}`}>{item.title}</h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>
            </div>
        )
    },
    'economy': {
        title: 'Экономика сервера',
        content: (
            <div className="space-y-8">
                <ScrollReveal>
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
                                <Coins className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold m-0 text-neutral-900 dark:text-neutral-200">Игровая экономика</h2>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                            На Horizon нет админ-шопов или командной экономики. Вся торговля осуществляется игроками. Ценность ресурсов определяется спросом и предложением, создавая живой свободный рынок.
                        </p>
                    </section>
                </ScrollReveal>

                <section>
                    <ScrollReveal delay={200}>
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">Типы магазинов</h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ScrollReveal delay={300} className="h-full">
                            <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 p-5 rounded-xl hover:shadow-md transition-all h-full">
                                <ShoppingBag className="w-8 h-8 text-neutral-900 dark:text-neutral-200 mb-3" />
                                <h4 className="font-bold mb-2 text-neutral-900 dark:text-neutral-200">Прилавки</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Простые магазины с сундуками и табличками цен. Оплата производится вручную.</p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={400} className="h-full">
                            <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 p-5 rounded-xl hover:shadow-md transition-all h-full">
                                <Coins className="w-8 h-8 text-neutral-900 dark:text-neutral-200 mb-3" />
                                <h4 className="font-bold mb-2 text-neutral-900 dark:text-neutral-200">Авто-магазины</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Механизмы на редстоуне для автоматического обмена ресурсов.</p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={500} className="h-full">
                            <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 p-5 rounded-xl hover:shadow-md transition-all h-full">
                                <Users className="w-8 h-8 text-neutral-900 dark:text-neutral-200 mb-3" />
                                <h4 className="font-bold mb-2 text-neutral-900 dark:text-neutral-200">Торговые центры</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Объединения игроков в торговых районах для удобства покупателей.</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                <section>
                    <ScrollReveal delay={600}>
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">Ценность ресурсов</h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 dark:bg-neutral-900/30 p-4 rounded-xl border border-neutral-200 dark:border-white/5">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-200 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    Высокая ценность
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Незерит', 'Алмазы', 'Изумруды', 'Древние обломки', 'Эхо-осколки'].map(item => (
                                        <span key={item} className="bg-white dark:bg-[#1a1a1a] px-2 py-1 rounded text-sm border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 shadow-sm">{item}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-900/30 p-4 rounded-xl border border-neutral-200 dark:border-white/5">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-200 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Средняя ценность
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Золото', 'Редстоун', 'Лазурит', 'Медь', 'Слизь'].map(item => (
                                        <span key={item} className="bg-white dark:bg-[#1a1a1a] px-2 py-1 rounded text-sm border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 shadow-sm">{item}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>
            </div>
        )
    },
    'about': {
        title: 'О сервере Horizon',
        content: (
            <div className="space-y-8">
                <ScrollReveal>
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
                                <Info className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold m-0 text-neutral-900 dark:text-neutral-200">Что такое Horizon?</h2>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 text-lg">
                            Horizon — это приватный ванильный сервер Minecraft версии 1.21.4+, созданный для тех, кто ценит атмосферу, дружбу и чистый геймплей. Мы отказались от лишних плагинов и доната, чтобы сохранить дух настоящей игры.
                        </p>
                    </section>
                </ScrollReveal>

                <section>
                    <ScrollReveal delay={200}>
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">Особенности сервера</h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { title: 'Ванильный геймплей', desc: 'Никаких приватов, телепортов и /spawn. Только чистый Minecraft.' },
                            { title: 'Честная игра', desc: 'Отсутствие доната, влияющего на баланс. Все равны.' },
                            { title: 'Самоуправление', desc: 'Игроки сами решают судьбу сервера через голосования.' },
                            { title: 'Безопасность', desc: 'Мощная защита от DDoS и регулярные бэкапы мира.' },
                        ].map((item, i) => (
                            <ScrollReveal key={item.title} delay={i * 100} className="h-full">
                                <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 p-5 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors h-full">
                                    <h4 className="font-bold mb-2 text-neutral-900 dark:text-neutral-200">{item.title}</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>

                <ScrollReveal delay={400}>
                    <section className="bg-neutral-50 dark:bg-neutral-900/30 rounded-xl p-6 border border-neutral-200 dark:border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">Техническая информация</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-white/5 pb-2">
                                <span className="text-neutral-600 dark:text-neutral-400">Версия</span>
                                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-200">1.21.4+ (Java)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-white/5 pb-2">
                                <span className="text-neutral-600 dark:text-neutral-400">IP-адрес</span>
                                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-200">horizonserver.space</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-600 dark:text-neutral-400">Слоты</span>
                                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-200">20</span>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            </div>
        )
    },
    'commands': {
        title: 'Команды сервера',
        content: (
            <CommandsSection />
        )
    }
}

function CommandsSection() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    const commands = [
        { cmd: '/ping', desc: 'Показать ваш пинг до сервера', example: '-', category: 'basic' },
        { cmd: '/tps', desc: 'Показать текущий TPS (тики в секунду) сервера', example: '-', category: 'basic' },
        { cmd: '/tpsbar', desc: 'Отображение TPS в виде полоски', example: '-', category: 'basic' },
        { cmd: '/w [игрок] [сообщение]', desc: 'Отправить личное сообщение игроку', example: '/w Player123 Привет!', category: 'interaction' },
        { cmd: '/tell [игрок] [сообщение]', desc: 'Отправить личное сообщение игроку (аналог /w)', example: '/tell Player123 Как дела?', category: 'interaction' },
        { cmd: '/reply [сообщение]', desc: 'Ответить на последнее личное сообщение', example: '/reply Хорошо, спасибо!', category: 'interaction' },
        { cmd: '/ignore add [игрок]', desc: 'Добавить игрока в список игнорируемых', example: '/ignore add Player123', category: 'interaction' },
        { cmd: '/ignore remove [игрок]', desc: 'Удалить игрока из списка игнорируемых', example: '/ignore remove Player123', category: 'interaction' },
        { cmd: '/sit', desc: 'Сесть на ступеньки или блок', example: '-', category: 'interaction' },
        { cmd: '/lay', desc: 'Лечь на спину', example: '-', category: 'interaction' },
        { cmd: '/crawl', desc: 'Ползти', example: '-', category: 'interaction' },
        { cmd: '/skin [ник]', desc: 'Установить скин по нику', example: '/skin Notch', category: 'skins' },
        { cmd: '/skin url [ссылка]', desc: 'Установить скин по ссылке', example: '/skin url http://example.com/skin.png', category: 'skins' },
        { cmd: '/co i', desc: 'Включить режим инспектора (проверка логов блоков)', example: '-', category: 'tracking' },
    ]

    const filteredCommands = commands.filter(cmd => {
        const matchesSearch = cmd.cmd.toLowerCase().includes(search.toLowerCase()) || cmd.desc.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || cmd.category === filter
        return matchesSearch && matchesFilter
    })

    const filters = [
        { id: 'all', label: 'Все команды' },
        { id: 'basic', label: 'Основные' },
        { id: 'interaction', label: 'Взаимодействие' },
        { id: 'tracking', label: 'Отслеживание' },
        { id: 'skins', label: 'Скины' },
    ]

    return (
        <div className="space-y-8">
            <ScrollReveal>
                <p className="text-muted-foreground">
                    На сервере Horizon доступны различные команды, которые помогут вам в игре. Ниже приведен список доступных команд с описанием их функций.
                </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
                <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <div className="flex flex-wrap gap-2">
                            {filters.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                        filter === f.id
                                            ? "bg-neutral-900 dark:bg-neutral-200 text-white dark:text-black"
                                            : "bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-[#222] text-muted-foreground"
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Поиск команд..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-white/5">
                                    <th className="py-3 px-4 font-semibold text-sm text-muted-foreground w-1/4">Команда</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-muted-foreground w-2/4">Описание</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-muted-foreground w-1/4">Пример</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                                {filteredCommands.map((cmd, i) => (
                                    <tr key={i} className="group hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 align-top">
                                            <code className="bg-neutral-100 dark:bg-[#1a1a1a] px-2 py-1 rounded text-sm font-mono text-neutral-900 dark:text-neutral-200 whitespace-nowrap">
                                                {cmd.cmd.split(' ')[0]}
                                            </code>
                                            {cmd.cmd.split(' ').length > 1 && (
                                                <span className="text-xs text-muted-foreground ml-2 hidden md:inline-block">
                                                    {cmd.cmd.substring(cmd.cmd.indexOf(' '))}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-neutral-700 dark:text-neutral-300 align-top">
                                            {cmd.desc}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-muted-foreground font-mono align-top">
                                            {cmd.example}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCommands.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Команды не найдены
                            </div>
                        )}
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default function WikiContent({ section }) {
    const data = sections[section]

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                    <HelpCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Раздел не найден</h2>
                <p className="text-muted-foreground">Выберите раздел в меню слева.</p>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900 dark:text-neutral-200">
                {data.title}
            </h1>
            <div className="max-w-none prose prose-neutral dark:prose-invert">
                {data.content}
            </div>
        </div>
    )
}
