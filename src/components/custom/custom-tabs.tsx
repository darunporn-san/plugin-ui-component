import * as React from "react"
import { cn } from "src/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

interface CustomTabsProps extends Omit<React.ComponentProps<typeof Tabs>, 'orientation'> {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  tabListClassName?: string
  tabTriggerClassName?: string
  tabContentClassName?: string
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

const CustomTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  CustomTabsProps
>(
  ({
    tabs,
    defaultValue,
    className,
    tabListClassName,
    tabTriggerClassName,
    tabContentClassName,
    children,
    orientation = 'horizontal',
    ...props
  }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value)

    return (
      <Tabs
        ref={ref}
        value={activeTab}
        onValueChange={setActiveTab}
        orientation={orientation}
        className={cn(
          "w-full",
          orientation === 'vertical' ? 'flex gap-4' : 'flex-col',
          className
        )}
        {...props}
      >
        <TabsList 
          className={cn(
            "bg-background rounded-none",
            orientation === 'horizontal' 
              ? "w-full p-0 justify-start border-b rounded-none"
              : "w-auto h-auto justify-start  flex-col p-2 border-r rounded-l",
            tabListClassName
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "bg-background data-[state=active]:shadow-none border border-transparent",
                orientation === 'horizontal'
                  ? "h-full -mb-[2px] rounded-t border-b-border data-[state=active]:border-border data-[state=active]:border-b-background"
                  : "w-full justify-start data-[state=active]:border-l-2 data-[state=active]:border-l-primary data-[state=active]:bg-muted/50",
                tabTriggerClassName
              )}
            >
              <code className="text-[13px]">{tab.label}</code>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className={cn(
          orientation === 'horizontal' ? "mt-4" : "flex-1",
          tabContentClassName
        )}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.props.value === activeTab) {
              return child
            }
            return null
          })}
        </div>
      </Tabs>
    )
  }
)

CustomTabs.displayName = "CustomTabs"

const CustomTabContent = TabsContent

CustomTabContent.displayName = "CustomTabContent"

export { CustomTabs, CustomTabContent }
