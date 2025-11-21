import { Link, useRoute } from 'wouter'
import { Book, Info, Play, Shield, CircleDollarSign, Map, Terminal } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function WikiSidebar() {
  const [match, params] = useRoute('/wiki/:section?')
  const currentSection = params?.section || 'getting-started'

  const links = [
    {
      href: '/wiki/about',
      label: 'О сервере',
      desc: 'Информация о сервере и команде',
      id: 'about',
      icon: Info
    },
    {
      href: '/wiki/getting-started',
      label: 'Начало игры',
      desc: 'Как присоединиться к серверу',
      id: 'getting-started',
      icon: Play
    },
    {
      href: '/rules',
      label: 'Правила',
      desc: 'Правила сервера',
      id: 'rules',
      icon: Shield,
      external: true // Marks that this link goes out of /wiki structure visually or logically
    },
    {
      href: '/wiki/economy',
      label: 'Экономика',
      desc: 'Торговля и экономические механики',
      id: 'economy',
      icon: CircleDollarSign
    },
    {
      href: '/wiki/territories',
      label: 'Территории',
      desc: 'Правила приватизации и строительства',
      id: 'territories',
      icon: Map
    },
    {
      href: '/wiki/commands',
      label: 'Команды',
      desc: 'Список команд сервера',
      id: 'commands',
      icon: Terminal
    },
  ]

  return (
    <div className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
      <div className="sticky top-28 bg-white dark:bg-[#111] rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm overflow-hidden p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-neutral-900 dark:text-white">Вики</h3>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            // Check if active: either matches wiki section OR matches exact path for rules
            const isActive = currentSection === link.id || (link.href === '/rules' && window.location.pathname === '/rules')

            return (
              <Link key={link.href} href={link.href}>
                <a
                  className={cn(
                    "flex items-start gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-neutral-100 dark:bg-white/5"
                      : "hover:bg-neutral-50 dark:hover:bg-white/5"
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 mt-0.5 transition-colors",
                    isActive ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                  )} />
                  <div>
                    <div className={cn(
                      "font-semibold text-base transition-colors",
                      isActive ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200"
                    )}>
                      {link.label}
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-neutral-500 leading-snug mt-0.5">
                      {link.desc}
                    </div>
                  </div>
                </a>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
