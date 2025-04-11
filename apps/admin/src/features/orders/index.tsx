import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderService, OrderStatus } from '@/services/order.service'
import { handleServerError } from '@/utils/handle-server-error'
import { Badge } from '@/components/ui/badge'
import { IconEye } from '@tabler/icons-react'
import { Pagination } from '@/components/ui/pagination'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { addDays } from 'date-fns'

// 订单状态映射
const orderStatusMap = {
  [OrderStatus.PENDING]: { label: '待付款', variant: 'outline' as const },
  [OrderStatus.PAID]: { label: '已付款', variant: 'default' as const },
  [OrderStatus.SHIPPED]: { label: '已发货', variant: 'default' as const },
  [OrderStatus.DELIVERED]: { label: '已送达', variant: 'success' as const },
  [OrderStatus.COMPLETED]: { label: '已完成', variant: 'success' as const },
  [OrderStatus.CANCELLED]: { label: '已取消', variant: 'destructive' as const },
  [OrderStatus.REFUNDED]: { label: '已退款', variant: 'destructive' as const },
}

export default function Orders() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [orderNumber, setOrderNumber] = useState('')
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // 获取订单列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', page, pageSize, orderNumber, status, dateRange],
    queryFn: async () => {
      try {
        return await OrderService.getOrders({
          page,
          pageSize,
          orderNumber: orderNumber || undefined,
          status,
          startDate: dateRange.from ? dateRange.from.toISOString() : undefined,
          endDate: dateRange.to ? dateRange.to.toISOString() : undefined,
        })
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  })

  // 处理搜索
  const handleSearch = () => {
    setPage(1)
    refetch()
  }

  // 处理重置
  const handleReset = () => {
    setOrderNumber('')
    setStatus(undefined)
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    })
    setPage(1)
    refetch()
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">订单管理</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">订单列表</h2>
            <p className="text-muted-foreground">
              管理您的订单，查看订单详情和更新订单状态。
            </p>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Input
              placeholder="订单编号"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
          <div>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部状态</SelectItem>
                {Object.entries(orderStatusMap).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="选择日期范围"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch}>搜索</Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>

        {/* 订单表格 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单编号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead className="text-right">金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : data?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                data?.items?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.consumer?.username || order.consumer?.email || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          orderStatusMap[order.status]?.variant || 'outline'
                        }
                      >
                        {orderStatusMap[order.status]?.label || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.paymentMethod || '-'}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        {data && (
          <div className="mt-4 flex items-center justify-end space-x-2">
            <div className="text-sm text-muted-foreground">
              共 {data.total} 条记录
            </div>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.total / pageSize)}
              onPageChange={setPage}
            />
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </Main>
    </>
  )
}
