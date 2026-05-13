-- ============================================
-- MOCK DATA: Theo dõi đường huyết, Thực đơn, Lịch trình sinh hoạt, Nhật ký tầm soát, Nhật ký sức khỏe
-- Chạy SAU schema.sql
-- User ID: ab406c69-dc3a-4b76-b998-1723205d036a (Admin)
-- ============================================

-- ============================================
-- 1. THEO DÕI ĐƯỜNG HUYẾT (Glucose Logs) - 14 ngày, mỗi ngày 6 lần đo
-- ============================================
DO $$
DECLARE
  i INT;
  base_date TIMESTAMP;
  glucose_value DECIMAL(4,1);
BEGIN
  FOR i IN 0..13 LOOP
    base_date := CURRENT_TIMESTAMP - (i || ' days')::INTERVAL;

    -- Fasting morning (7:00)
    glucose_value := (5.0 + (random() * 1.5))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES ('ab406c69-dc3a-4b76-b998-1723205d036a', glucose_value, 'mmol/L', 'fasting', 'Đo sau khi thức dậy, chưa ăn gì', base_date + INTERVAL '7 hours');

    -- Before lunch (11:30)
    glucose_value := (5.5 + (random() * 1.5))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES ('ab406c69-dc3a-4b76-b998-1723205d036a', glucose_value, 'mmol/L', 'before_meal', 'Trước bữa trưa 30 phút', base_date + INTERVAL '11 hours 30 minutes');

    -- After lunch (13:30)
    glucose_value := (6.5 + (random() * 2.5))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES ('ab406c69-dc3a-4b76-b998-1723205d036a', glucose_value, 'mmol/L', 'after_meal', 'Sau ăn trưa 2 giờ', base_date + INTERVAL '13 hours 30 minutes');

    -- Before dinner (18:00)
    glucose_value := (5.8 + (random() * 1.2))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES ('ab406c69-dc3a-4b76-b998-1723205d036a', glucose_value, 'mmol/L', 'before_meal', 'Trước bữa tối 30 phút', base_date + INTERVAL '18 hours');

    -- After dinner (20:30)
    glucose_value := (6.8 + (random() * 2.0))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES ('ab406c69-dc3a-4b76-b998-1723205d036a', glucose_value, 'mmol/L', 'after_meal', 'Sau ăn tối 2 giờ', base_date + INTERVAL '20 hours 30 minutes');

    -- Bedtime (21:30)
    glucose_value := (6.0 + (random() * 1.0))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES ('ab406c69-dc3a-4b76-b998-1723205d036a', glucose_value, 'mmol/L', 'bedtime', 'Trước khi đi ngủ', base_date + INTERVAL '21 hours 30 minutes');
  END LOOP;
END $$;

-- ============================================
-- 2. THỰC ĐƠN NHẬT KÝ (Meals) - 27 món ăn với GI levels
-- ============================================
INSERT INTO public.meals (user_id, name, gi_level, time, notes)
VALUES
  -- Bữa sáng (07:00)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Yến mạch with hạt chia và việt quất', 'low', '07:00', 'Giàu chất xơ hòa tan, ổn định đường huyết buổi sáng'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bánh mì đen nguyên cám 2 lát', 'medium', '07:00', 'Thay thế bánh mì trắng, giảm đường huyết'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Trứng luộc 2 quả', 'low', '07:00', 'Protein hoàn chỉnh, no lâu, không ảnh hưởng đường huyết'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Sữa chua Hy Lạp không đường', 'low', '07:00', 'Probiotics tốt cho tiêu hóa, GI thấp'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bơ half quả với trứng', 'low', '07:00', 'Chất béo tốt MUFA, protein thực vật'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Cháo yến mạch with quả mọng', 'low', '07:00', 'Beta-glucan cao, giảm cholesterol'),

  -- Bữa trưa (12:00)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Salad cá ngừ với rau xanh', 'low', '12:00', 'Omega-3, protein sạch, rau xanh giảm đường'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bông cải xanh xào tỏi', 'low', '12:00', 'Sulforaphane chống oxy hóa, ổn định insulin'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Cá hồi Na Uy nướng', 'low', '12:00', 'DHA omega-3, protein cao, GI thấp'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Thịt gà nạc luộc với rau củ', 'low', '12:00', 'Protein sạch 100g, không carb'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Thịt bò nạc stir-fry với ớt chuông', 'medium', '12:00', 'Iron, kẽm, vitamin B12'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Tofu xào với nấm và đậu đũa', 'low', '12:00', 'Đạo thực vật, isoflavones tốt cho tim'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Gạo lứt 1 chén', 'medium', '12:00', 'Thay thế gạo trắng, GI 50-55'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Khoai lang nướng 1 củ vừa', 'medium', '12:00', 'GI thấp hơn khoai tây, giàu vitamin A'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Rau bina xào tỏi', 'low', '12:00', 'Magiê cao, ổn định đường huyết'),

  -- Bữa phụ (15:00)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Táo xanh 1 quả', 'low', '15:00', 'Chất xơ pectin cao, fructose tự nhiên thấp'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bưởi half quả', 'low', '15:00', 'Naringenin giảm đường huyết tự nhiên'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Cherry 15 quả', 'low', '15:00', 'Anthocyanin chống oxy hóa mạnh'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Dâu tây 10 quả', 'low', '15:00', 'Ít carb, nhiều vitamin C, chống viêm'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Hạt óc chó 8-10 hạt', 'low', '15:00', 'Omega-3 ALA, magnesium cao'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Hạt chia 1 muỗng canh', 'low', '15:00', 'Chất xơ cao gấp 3 lần, gel hòa tan'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Hạt hướng dương 30g', 'medium', '15:00', 'Vitamin E, tocopherol tốt cho da'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đậu phộng rang 30g', 'medium', '15:00', 'Protein thực vật, arginine có lợi'),

  -- Đồ uống (08:00)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Trà xanh 2 tách', 'low', '08:00', 'EGCG chống oxy hóa, tăng nhạy cảm insulin'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Cà phê đen không đường 1 tách', 'medium', '08:00', 'Chlorogenic acid giảm đường huyết, uống vừa phải'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Nước ép rau củ xanh', 'low', '08:00', 'Cần tây + dưa leo + gừng, không thêm đường');

-- ============================================
-- 3. LỊCH TRÌNH SINH HOẠT (Activity Schedules) - 14 ngày
-- ============================================
INSERT INTO public.activity_schedules (user_id, activity_name, scheduled_date, scheduled_time, duration_minutes, calories_burned, completed, notes)
VALUES
  -- Week 1
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-01', '06:00', 30, 150, true, 'Đi bộ quanh hồ Giang Vo, trời mát'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-02', '06:00', 30, 155, true, 'Tăng tốc nhẹ ở phút cuối'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Yoga nhẹ', '2024-05-03', '19:00', 45, 120, true, 'Tư thế cây cầu, con bướm, thiền định'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-04', '06:00', 30, 150, true, 'Đi bộ với vợ, 5500 bước'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đạp xe', '2024-05-05', '17:00', 40, 250, true, 'Đạp xe quanh hồ Truc Bach, trời đẹp'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bơi lội', '2024-05-06', '09:00', 45, 300, true, 'Bơi 15 vòng (25m/vòng), cảm thấy khỏe'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-07', '06:30', 35, 180, true, 'Đi bộ chủ nhật, hít thở sâu'),

  -- Week 2
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-08', '06:00', 30, 150, true, 'Sau cảm cúm, chỉ đi bộ nhẹ'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Yoga nhẹ', '2024-05-09', '19:00', 40, 100, false, 'Trời mưa nên bỏ, nghỉ ngơi'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-10', '06:00', 30, 155, true, 'Hồi phục sau cảm, đi chậm'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ cuối tuần', '2024-05-11', '07:00', 45, 220, true, 'Đi bộ công viên Thống Nhất, 7000 bước'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bơi lội', '2024-05-12', '09:00', 50, 350, true, 'Bơi 20 vòng, tập trung kỹ thuật'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-13', '06:00', 30, 150, true, 'Đi bộ hàng ngày'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Yoga nhẹ', '2024-05-14', '19:00', 45, 130, true, 'Thiền định + kéo giãn cơ'),

  -- Week 3 (current)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-15', '06:00', 30, 160, true, 'Tăng 500 bước so với tuần trước'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đạp xe', '2024-05-16', '17:00', 40, 260, true, 'Đạp xe nhanh, tim đập đều'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-17', '06:00', 35, 175, true, 'Đi bộ nhanh hơn'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Yoga nhẹ', '2024-05-18', '19:00', 50, 140, true, 'Tập thêm tư thế cây cầu nâng cao'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Nghỉ ngơi', '2024-05-19', '08:00', 0, 0, false, 'Chủ nhật nghỉ ngơi hoàn toàn'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-20', '06:00', 30, 150, true, 'Thứ 2 đi bộ đầu tuần'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Bơi lội', '2024-05-21', '09:00', 45, 320, true, 'Bơi 18 vòng, sáng khoái'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Đi bộ sáng', '2024-05-22', '06:00', 30, 150, true, 'Đi bộ hàng ngày'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Yoga nhẹ', '2024-05-23', '19:00', 45, 125, true, 'Thiền định + yoga phục hồi');

-- ============================================
-- 4. NHẬT KÝ TẦM SOÁT (Lab Results) - Xét nghiệm máu 3 tháng
-- ============================================
INSERT INTO public.lab_results (user_id, type, value, unit, recorded_at, notes)
VALUES
  -- HbA1c - Theo dõi mỗi 3 tháng (mục tiêu < 7%)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'hba1c', 6.8, '%', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Tốt - đạt mục tiêu < 7%. Duy trì chế độ ăn hiện tại'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'hba1c', 6.9, '%', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Gần mục tiêu, cần chú ý chế độ ăn'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'hba1c', 7.1, '%', CURRENT_TIMESTAMP - INTERVAL '75 days', 'Hơi cao, bác sĩ khuyên giảm tinh bột'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'hba1c', 7.3, '%', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Vượt mục tiêu, cần điều chỉnh thuốc'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'hba1c', 7.8, '%', CURRENT_TIMESTAMP - INTERVAL '195 days', 'Cao, bác sĩ tăng liều Metformin'),

  -- Cholesterol - Theo dõi mỗi 3 tháng (mục tiêu < 200 mg/dL)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'cholesterol', 185, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Bình thường - LDL giảm nhờ ăn cá'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'cholesterol', 188, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Bình thường, duy trì chế độ ăn mới'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'cholesterol', 195, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '75 days', 'Gần giới hạn, ăn thêm rau xanh'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'cholesterol', 202, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Hơi cao, bắt đầu uống Atorvastatin'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'cholesterol', 210, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '195 days', 'Cao, bác sĩ kê thêm Statin'),

  -- HDL Cholesterol (mục tiêu > 40 mg/dL)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 52, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'HDL tốt - cao hơn mục tiêu'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 48, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'HDL trung bình - cần cải thiện'),

  -- LDL Cholesterol (mục tiêu < 100 mg/dL)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 110, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'LDL hơi cao - tiếp tục theo dõi'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 125, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'LDL cao - ăn giảm mỡ động vật'),

  -- Creatinine - Theo dõi chức năng thận (mục tiêu 0.6-1.2 mg/dL)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'creatinine', 1.0, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Chức năng thận bình thường'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'creatinine', 0.95, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Thận hoạt động tốt'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'creatinine', 1.05, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '75 days', 'Trong giới hạn bình thường'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'creatinine', 1.1, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Bình thường - theo dõi định kỳ'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'creatinine', 1.15, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '195 days', 'Gần giới hạn trên - uống nhiều nước'),

  -- Triglycerides (mục tiêu < 150 mg/dL)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 135, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Triglycerides bình thường'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 145, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Gần giới hạn - cần giảm rượu'),

  -- Glucose Fasting (đường huyết đói - mục tiêu 4.4-6.1 mmol/L)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 5.4, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '7 days', 'Đường huyết đói tốt, kiểm soát tốt'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 5.6, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Bình thường, duy trì chế độ ăn'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 5.8, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '60 days', 'Bình thường, tập thể dục đều'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 6.2, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '90 days', 'Hơi cao, chú ý bữa tối'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'other', 6.8, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '120 days', 'Cao - bác sĩ điều chỉnh thuốc');

-- ============================================
-- 5. NHẬT KÝ SỨC KHỎE (Health Events) - Theo dõi hàng ngày
-- ============================================
INSERT INTO public.health_events (user_id, event_type, title, event_date, description)
VALUES
  -- Tuần 1 tháng 5
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Biến cố', 'Cảm cúm nhẹ & Sốt', '2024-05-01', 'Ngày đầu nghỉ phép: sốt 38.5°C, nhức đầu, chảy mũi. Đã đi khám BS Tai Mũi Họng, được kê thuốc súc họng và paracetamol.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Kiểm tra huyết áp buổi sáng', '2024-05-02', 'Huyết áp 118/78 mmHg - bình thường. Nhịp tim 72 bpm. Không có hiện tượng phù chân sau cảm cúm.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Đường huyết sau cảm cúm', '2024-05-03', 'Đường huyết tăng nhẹ sau cảm cúm: 6.8 mmol/L fasting. Bình thường sau vài ngày hồi phục.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Khám định kỳ bác sĩ nội tiết', '2024-05-04', 'Gặp BS Lan tại BV Nội tiết TW. HbA1c mới: 6.9%. Bác sĩ khuyên duy trì Metformin 500mg x 2 lần/ngày. Tái khám sau 3 tháng.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Biến cố', 'Mất ngủ 1 đêm', '2024-05-05', 'Do căng thẳng công việc, ngủ chỉ được 4 tiếng. Đường huyết sáng hôm sau tăng nhẹ 6.2 mmol/L.'),

  -- Tuần 2 tháng 5
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Huyết áp ổn định', '2024-05-08', 'Huyết áp duy trì mức 115/75 mmHg. Không có hiện tượng phù chân. Tiếp tục đi bộ 30 phút/ngày.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Bắt đầu chương trình tập thể dục mới', '2024-05-09', 'Đăng ký tập Yoga và Bơi lội. Tuần này: 3 buổi đi bộ, 1 buổi yoga, 1 buổi bơi. Cảm thấy khỏe hơn rõ rệt.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Cân nặng giảm nhẹ', '2024-05-10', 'Cân nặng: 67.8 kg (giảm 0.5 kg từ tuần trước). BMI 23.5 - bình thường. Tiếp tục duy trì chế độ ăn và tập luyện.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Đường huyết kiểm soát tốt sau tập', '2024-05-11', 'HbA1c mới về mức 6.8%. Đường huyết sau ăn 2h: 7.2 mmol/L - trong mục tiêu. Tiếp tục duy trì chế độ ăn hiện tại.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Xét nghiệm máu định kỳ', '2024-05-12', 'Đi xét nghiệm tại phòng khám. Kết quả: Cholesterol 185 mg/dL, Creatinine 1.0 mg/dL - tất cả bình thường. Rất mừng!'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Biến cố', 'Đau chân trái - tê bì ngón chân', '2024-05-13', 'Sau khi đi bộ dài, có cảm giác tê bì ngón chân trái. Đặt lịch khám chuyên khoa Nội tiết dây thần kinh.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Khám chuyên khoa thần kinh', '2024-05-14', 'Gặp BS Minh tại BV Thần kinh TW. Chẩn đoán: viêm dây thần kinh ngoại biên nhẹ. Kê thuốc Milgamma 1 viên/ngày. Tái khám sau 1 tháng.'),

  -- Tuần 3 tháng 5
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Tình trạng chân cải thiện', '2024-05-15', 'Sau 3 ngày uống Milgamma, tê bì giảm 50%. Tiếp tục uống thuốc đều đặn. Đi bộ giảm còn 20 phút/ngày.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Tập thể dục đều đặn', '2024-05-16', 'Tuần này hoàn thành: 5 buổi đi bộ, 2 buổi yoga. Tổng calorie đốt: 850 kcal. Cảm thấy khỏe hơn, ngủ ngon hơn.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Kiểm tra mắt định kỳ', '2024-05-17', 'Khám mắt tại BV Mắt TW. Kết quả: không có biến chứng võng mạc. Độ khúc xạ ổn định. Tiếp tục theo dõi 6 tháng/lần.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Uống thuốc đều đặn', '2024-05-18', 'Tuần này nhớ uống thuốc đầy đủ. Không quên lần nào. Metformin + Atorvastatin + Milgamma. Tốt lắm!'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Biến cố', 'Bữa trưa ăn nhiều tinh bột', '2024-05-19', 'Chủ nhật ăn phở bò nhiều. Sau ăn bị nhức đầu, đường huyết tăng 8.5 mmol/L sau 2h. Rút kinh nghiệm: ăn ít cơm, tránh đồ ngọt.'),

  -- Tuần 4 tháng 5 (tuần hiện tại)
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Điều chỉnh lại chế độ ăn', '2024-05-20', 'Cắt giảm tinh bột: 1/2 chén cơm/bữa. Thay thế bằng rau xanh và đậu. Bữa phụ: 1 quả táo hoặc vài hạt óc chó.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Kiểm soát đường huyết tốt hơn', '2024-05-21', 'Fasting: 5.4 mmol/L, sau ăn: 6.8 mmol/L - cả hai đều tốt. Chế độ ăn mới hiệu quả. Duy trì tiếp.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Cân nặng ổn định', '2024-05-22', 'Cân nặng: 67.0 kg - ổn định suốt tuần. BMI 23.3. Tiếp tục duy trì cân nặng hiện tại.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Huyết áp tốt', '2024-05-23', 'Huyết áp buổi sáng: 112/72 mmHg. Rất tốt. Tiếp tục đi bộ và ăn uống lành mạnh.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Biến cố', 'Đau đầu sau họp căng thẳng', '2024-05-24', 'Họp kéo dài 3 tiếng với áp lực deadline. Tối về đau đầu, mệt mỏi. Đường huyết sáng hôm sau 6.0 mmol/L - bình thường.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Ngủ sớm và ngủ đủ giấc', '2024-05-25', 'Cố gắng ngủ trước 22h, dậy 6h. Ngủ 7-8 tiếng/đêm. Cảm thấy tinh thần tốt hơn, đường huyết ổn định hơn.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Tuần nghỉ ngơi hợp lý', '2024-05-26', 'Cuối tuần nghỉ ngơi, không tập nặng. Đi dạo công viên với gia đình. Ăn uống lành mạnh. Tinh thần thoải mái.'),
  ('ab406c69-dc3a-4b76-b998-1723205d036a', 'Theo dõi', 'Tóm tắt tháng 5', '2024-05-27', 'Tháng này: HbA1c giảm 0.5%, cân nặng giảm 1.3kg, cholesterol về mức bình thường. Biến chứng thần kinh phát hiện sớm và điều trị kịp thời. Nhìn chung tháng 5 rất thành công!');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 'Mock data inserted successfully!
User ID: ab406c69-dc3a-4b76-b998-1723205d036a (Admin)
Tables populated:
- glucose_logs: 84 readings (14 days x 6 times/day)
- meals: 27 food items with GI levels
- activity_schedules: 25 activities (3 weeks)
- lab_results: 25 test results (3 months)
- health_events: 27 health diary entries' as status;