import { useRoute } from 'wouter'
import WikiSidebar from '../components/wiki/WikiSidebar'
import WikiContent from '../components/wiki/WikiContent'

export default function Wiki() {
    const [match, params] = useRoute('/wiki/:section?')
    const section = params?.section || 'getting-started'

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <WikiSidebar />
                <div className="flex-1 min-w-0">
                    <WikiContent section={section} />
                </div>
            </div>
        </div>
    )
}
