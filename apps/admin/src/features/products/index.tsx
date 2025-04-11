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
import { ProductService } from '@/services/product.service'
import { Badge } from '@/components/ui/badge'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { Pagination } from '@/components/ui/pagination'

export default function Products() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchName, setSearchName] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)

  // 获取商品列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', page, pageSize, searchName, categoryId, isActive],
    queryFn: async () => {
      try {
        const data = await ProductService.getProducts({
          page,
          pageSize,
          name: searchName || undefined,
          categoryId,
          isActive,
        })
        return data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  })

  // 获取商品分类
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await ProductService.getCategories()
        return res
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
    setSearchName('')
    setCategoryId(undefined)
    setIsActive(undefined)
    setPage(1)
    refetch()
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">商品管理</h1>
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
            <h2 className="text-2xl font-bold tracking-tight">商品列表</h2>
            <p className="text-muted-foreground">
              管理您的商品，包括添加、编辑和删除商品。
            </p>
          </div>
          <Button>添加商品</Button>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Input
              placeholder="商品名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="''">全部分类</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={isActive !== undefined ? String(isActive) : ''}
              onValueChange={(value) =>
                setIsActive(
                  value === '' ? undefined : value === 'true' ? true : false
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="商品状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="''">全部状态</SelectItem>
                <SelectItem value="true">上架</SelectItem>
                <SelectItem value="false">下架</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch}>搜索</Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>

        {/* 商品表格 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead className="text-right">价格</TableHead>
                <TableHead className="text-right">库存</TableHead>
                <TableHead>状态</TableHead>
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
              ) : !data || !data.records || data.records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                data.records.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category?.name || '-'}</TableCell>
                    <TableCell className="text-right">
                      ¥{product.price}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? 'default' : 'secondary'}
                      >
                        {product.isActive ? '上架' : '下架'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <IconTrash className="h-4 w-4" />
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
        {data && data.total !== undefined && (
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
