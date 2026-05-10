"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ChevronRight, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  read_time_minutes: number;
  created_at: string;
}

// Knowledge categories
const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "dinh-duong", label: "Dinh dưỡng" },
  { value: "the-duc", label: "Thể dục" },
  { value: "thuoc", label: "Thuốc" },
  { value: "phong-ngua", label: "Phòng ngừa" },
  { value: "bien-chung", label: "Biến chứng" },
];

// Generate mock articles
function generateMockArticles(): Article[] {
  const articles: Article[] = [
    {
      id: "1",
      title: "Chế độ ăn uống cho người tiểu đường type 2",
      content: `Người bệnh tiểu đường type 2 cần chú ý đến chế độ ăn uống để kiểm soát đường huyết.

**Nguyên tắc dinh dưỡng:**

1. **Chia nhỏ bữa ăn:** Ăn 3 bữa chính và 2-3 bữa phụ mỗi ngày, cách đều nhau khoảng 3-4 giờ.

2. **Ưu tiên thực phẩm GI thấp:**
   - Rau xanh: rau muống, cải xoong, bắp cải
   - Ngũ cốc nguyên hạt: gạo lứt, yến mạch
   - Đậu các loại: đậu đen, đậu đỏ
   - Trái cây ít đường: cam, quýt, bưởi

3. **Hạn chế:**
   - Đường tinh luyện, bánh kẹo ngọt
   - Thực phẩm chế biến sẵn
   - Đồ uống có cồn
   - Chất béo bão hòa

4. **Tăng cường chất xơ:** Chất xơ giúp ổn định đường huyết và tốt cho tiêu hóa.

**Mẹo thực tế:**
- Ăn rau trước khi ăn cơm
- Uống nước trước bữa ăn 30 phút
- Chọn cách nấu luộc, hấp thay chiên rán`,
      category: "dinh-duong",
      read_time_minutes: 5,
      created_at: new Date(-7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Tập thể dục an toàn cho người tiểu đường",
      content: `Vận động thể dục thể thao là yếu tố quan trọng giúp kiểm soát bệnh tiểu đường.

**Lợi ích của tập thể dục:**
- Tăng độ nhạy insulin
- Giảm đường huyết
- Kiểm soát cân nặng
- Tốt cho tim mạch
- Giảm stress

**Các bài tập phù hợp:**

1. **Đi bộ nhanh (khuyến nghị)**
   - 30 phút/ngày, 5 ngày/tuần
   - Tốc độ vừa phải

2. **Bơi lội**
   - Tốt cho khớp
   - Giảm áp lực lên chân

3. **Đạp xe**
   - Tốt cho tuần hoàn máu

4. **Yoga,气功**
   - Giảm stress
   - Tăng flexibility

**Lưu ý an toàn:**
- Kiểm tra đường huyết trước và sau tập
- Mang theo đồ ăn ngọt phòng hạ đường huyết
- Khởi động ấm trước khi tập
- Uống đủ nước
- Dừng tập ngay nếu thấy chóng mặt, mệt`,
      category: "the-duc",
      read_time_minutes: 4,
      created_at: new Date(-14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Hiểu đúng về thuốc điều trị tiểu đường",
      content: `Thuốc điều trị tiểu đường giúp kiểm soát đường huyết. Việc hiểu đúng về thuốc giúp điều trị hiệu quả hơn.

**Các nhóm thuốc thường dùng:**

1. **Metformin**
   - Thuốc đầu tiên được chỉ định
   - Giảm sản xuất glucose từ gan
   - Tăng độ nhạy insulin
   - Uống cùng hoặc sau bữa ăn

2. **Gliclazide (Diamicron)**
   - Kích thích tuyến tụy tiết insulin
   - Uống trước bữa ăn
   - Có thể gây hạ đường huyết

3. **Thuốc ức chế alpha-glucosidase**
   - Làm chậm hấp thu đường
   - Uống cùng bữa ăn đầu tiên

**Nguyên tắc sử dụng:**
- Uống đúng liều, đúng giờ
- Không tự ngừng thuốc
- Thông báo cho bác sĩ về các thuốc khác đang dùng
- Theo dõi tác dụng phụ

**Tác dụng phụ cần lưu ý:**
- Buồn nôn, tiêu chảy (Metformin)
- Hạ đường huyết (Gliclazide)
- Tăng cân (một số thuốc)`,
      category: "thuoc",
      read_time_minutes: 6,
      created_at: new Date(-21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Phòng ngừa biến chứng tiểu đường",
      content: `Tiểu đường có thể gây ra nhiều biến chứng nguy hiểm. Phòng ngừa sớm giúp giảm nguy cơ.

**Biến chứng thường gặp:**

1. **Biến chứng mạch máu:**
   - Bệnh tim mạch
   - Đột quỵ
   - Bệnh động mạch chi dưới

2. **Biến chứng thần kinh:**
   - Tê bì chân tay
   - Đau dây thần kinh

3. **Biến chứng thận:**
   - Suy thận

4. **Biến chứng mắt:**
   - Loét võng mạc
   - Mù lòa

5. **Vết thương khó lành:**
   - Chân đái đường

**Cách phòng ngừa:**

1. **Kiểm soát đường huyết tốt:**
   - HbA1c < 7%
   - Đường huyết đói: 4.0-7.0 mmol/L
   - Đường huyết sau ăn: < 10 mmol/L

2. **Kiểm tra định kỳ:**
   - Khám mắt hàng năm
   - Xét nghiệm máu 3 tháng/lần
   - Kiểm tra chức năng thận

3. **Chăm sóc bàn chân:**
   - Giữ sạch và khô ráo
   - Khỏ đi chân trần
   - Chọn giày thoải mái`,
      category: "phong-ngua",
      read_time_minutes: 5,
      created_at: new Date(-28 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Nhận biết và xử lý hạ đường huyết",
      content: `Hạ đường huyết là tình trạng nguy hiểm cần xử lý kịp thời.

**Dấu hiệu hạ đường huyết:**
- Run tay, chân
- Đổ mồ hôi
- Tim đập nhanh
- Hoa mắt, chóng mặt
- Cảm giác đói
- Lú lẫn, khó tập trung
- Ngất xỉu (nặng)

**Nguyên nhân:**
- Dùng thuốc quá liều
- Bỏ bữa ăn sau khi uống thuốc
- Tập thể dục quá sức
- Uống rượu bia

**Cách xử lý:**

Bước 1: Đo đường huyết ngay
- Nếu < 3.9 mmol/L = hạ

Bước 2: Bổ sung đường nhanh:
- 15-20g đường (3-4 viên đường)
- 150ml nước ngọt
- 1 thìa mật ong

Bước 3: Đo lại sau 15 phút
- Nếu vẫn thấp, bổ sung thêm

Bước 4: Ăn bữa ăn nhẹ sau 30 phút

**Phòng ngừa:**
- Ăn đủ bữa, đúng giờ
- Mang theo đồ ăn ngọt
- Kiểm tra đường huyết trước khi lái xe`,
      category: "phong-ngua",
      read_time_minutes: 4,
      created_at: new Date(-35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return articles.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Article Card
function ArticleCard({
  article,
  onClick,
}: {
  article: Article;
  onClick: () => void;
}) {
  const categoryLabel =
    CATEGORIES.find((c) => c.value === article.category)?.label ||
    article.category;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors duration-200"
    >
      <h3 className="text-body-lg font-semibold text-on-surface mb-2 line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-3">
        <Badge variant="default">{categoryLabel}</Badge>
        <div className="flex items-center gap-1 text-label-lg text-on-surface-variant">
          <Timer className="w-3 h-3" />
          {article.read_time_minutes} phút đọc
        </div>
      </div>
    </button>
  );
}

// Article Content Modal
function ArticleContentModal({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const categoryLabel =
    CATEGORIES.find((c) => c.value === article.category)?.label ||
    article.category;

  return (
    <div className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onClose} className="mb-4">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Quay lại
          </Button>

          <Card variant="elevated">
            <CardHeader>
              <Badge variant="default" className="mb-2">
                {categoryLabel}
              </Badge>
              <CardTitle className="text-headline-md">{article.title}</CardTitle>
              <div className="flex items-center gap-1 text-label-lg text-on-surface-variant mt-2">
                <Timer className="w-4 h-4" />
                {article.read_time_minutes} phút đọc
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-on-surface">
                {article.content.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-4 text-body-lg leading-relaxed whitespace-pre-line"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function KienThucPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = generateMockArticles();
      setArticles(data);
      setFilteredArticles(data);
      setLoading(false);
    }, 300);
  }, []);

  // Filter articles when search or category changes
  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery, selectedCategory]);

  return (
    <Page title="Kiến thức">
      <div className="space-y-4 p-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-touch-target pl-10 pr-4 py-3 rounded-lg bg-surface-container-low border border-outline text-body-lg text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full min-h-touch-target text-label-lg",
                "transition-colors duration-200",
                selectedCategory === cat.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles List */}
        {!loading ? (
          filteredArticles.length > 0 ? (
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
              <p className="text-body-lg text-on-surface-variant">
                Không tìm thấy bài viết nào
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            Đang tải...
          </div>
        )}
      </div>

      {/* Article Content Modal */}
      {selectedArticle && (
        <ArticleContentModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </Page>
  );
}