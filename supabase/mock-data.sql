-- ============================================
-- Mock Data Script for Sổ Tay Tiểu Đường
-- Run AFTER schema.sql in Supabase SQL Editor
-- https://app.supabase.com/project/{project}/sql
--
-- NOTE: This script uses NULL user_id for demo purposes
-- In production, user_id should link to auth.users
-- ============================================

-- ============================================
-- GLUCOSE LOGS (14 days of data)
-- ============================================
DO $$
DECLARE
  base_date TIMESTAMP;
BEGIN
  FOR i IN 0..13 LOOP
    base_date := CURRENT_TIMESTAMP - (i || ' days')::INTERVAL;

    INSERT INTO public.glucose_logs (user_id, value, unit, timing, measured_at)
    VALUES
      (NULL, 5.2 + (random() * 1.5)::DECIMAL(4,1), 'mmol/L', 'fasting', base_date + interval '7 hours'),
      (NULL, 6.1 + (random() * 1.5)::DECIMAL(4,1), 'mmol/L', 'before_meal', base_date + interval '11 hours 30 minutes'),
      (NULL, 7.2 + (random() * 2.0)::DECIMAL(4,1), 'mmol/L', 'after_meal', base_date + interval '13 hours'),
      (NULL, 6.5 + (random() * 1.5)::DECIMAL(4,1), 'mmol/L', 'bedtime', base_date + interval '21 hours');
  END LOOP;
END $$;

-- ============================================
-- MEDICATIONS
-- ============================================
INSERT INTO public.medications (user_id, name, dosage, instructions, schedule_time, frequency)
VALUES
  (NULL, 'Metformin', '500mg', 'Uống sau bữa ăn sáng', '07:00', 'daily'),
  (NULL, 'Gliclazide', '80mg', 'Uống trước bữa ăn sáng', '07:00', 'daily'),
  (NULL, 'Metformin', '500mg', 'Uống sau bữa ăn tối', '19:00', 'daily'),
  (NULL, 'Aspirin', '81mg', 'Uống sau bữa ăn tối', '19:00', 'daily');

-- ============================================
-- MEALS (7 days of data)
-- ============================================
DO $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 0..6 LOOP
    INSERT INTO public.meals (user_id, name, gi_level, time, notes)
    VALUES
      (NULL, 'Bữa sáng ngày ' || (i+1), 'medium', '07:00', 'Nặng ~350kcal'),
      (NULL, 'Bữa trưa ngày ' || (i+1), 'low', '12:00', 'Nặng ~550kcal'),
      (NULL, 'Bữa xế ngày ' || (i+1), 'high', '15:00', 'Trái cây hoặc snack'),
      (NULL, 'Bữa tối ngày ' || (i+1), 'low', '19:00', 'Nặng ~500kcal');
  END LOOP;
END $$;

-- ============================================
-- LAB RESULTS (3 months of data)
-- ============================================
INSERT INTO public.lab_results (user_id, type, value, unit, recorded_at, notes)
VALUES
  -- HbA1c - quarterly
  (NULL, 'hba1c', 6.8, '%', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Tốt - đạt mục tiêu'),
  (NULL, 'hba1c', 7.1, '%', CURRENT_TIMESTAMP - INTERVAL '90 days', 'Gần mục tiêu'),
  (NULL, 'hba1c', 7.5, '%', CURRENT_TIMESTAMP - INTERVAL '180 days', 'Cần cải thiện'),
  (NULL, 'hba1c', 8.2, '%', CURRENT_TIMESTAMP - INTERVAL '270 days', 'Cao - cần điều chỉnh thuốc'),

  -- Cholesterol - quarterly
  (NULL, 'cholesterol', 185, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Bình thường'),
  (NULL, 'cholesterol', 192, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '90 days', 'Bình thường'),
  (NULL, 'cholesterol', 210, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '180 days', 'Hơi cao'),
  (NULL, 'cholesterol', 205, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '270 days', 'Hơi cao'),

  -- Creatinine - quarterly
  (NULL, 'creatinine', 1.0, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Bình thường'),
  (NULL, 'creatinine', 0.95, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '90 days', 'Bình thường'),
  (NULL, 'creatinine', 1.1, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '180 days', 'Bình thường'),
  (NULL, 'creatinine', 1.05, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '270 days', 'Bình thường');

-- ============================================
-- MEMORIAL QUOTES
-- ============================================
INSERT INTO public.memorial_quotes (user_id, content, author)
VALUES
  (NULL, 'Cuộc sống không phải là việc chờ đợi bão tố đi qua, mà là học cách nhảy múa dưới mưa.', 'Ngạn'),
  (NULL, 'Mẹ luôn nói: Con là món quà quý nhất mà cuộc sống đã ban tặng.', 'Gia đình'),
  (NULL, 'Hãy sống như hôm nay là ngày cuối cùng, và yêu thương như chưa từng được yêu thương.', 'Unknown');

-- ============================================
-- MEMORIAL STORIES
-- ============================================
INSERT INTO public.memorial_stories (user_id, title, content, date)
VALUES
  (NULL, 'Kỷ niệm đầu tiên', 'Đó là một buổi chiều mùa hè năm 1995, khi tôi còn nhỏ. Mẹ dẫn tôi đi chơi công viên lần đầu tiên...', '1995-06-15'),
  (NULL, 'Bài học về sức khỏe', 'Mẹ luôn dạy tôi rằng sức khỏe là tài sản quý giá nhất. Bây giờ, sau nhiều năm, tôi mới thực sự hiểu điều đó...', '2010-03-20'),
  (NULL, 'Ngày sinh nhật cuối cùng', 'Ngày sinh nhật cuối cùng của mẹ, cả gia đình sum họp đầy đủ. Không ai biết đó sẽ là kỷ niệm cuối cùng...', '2020-08-10');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 'Mock data inserted successfully!
- 14 days x 4 glucose readings = 56 glucose logs
- 4 medications
- 7 days x 4 meals = 28 meals
- 12 lab results (HbA1c, Cholesterol, Creatinine)
- 3 memorial quotes
- 3 memorial stories' as status;
