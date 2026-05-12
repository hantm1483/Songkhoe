-- ============================================
-- Mock Data Script for SỐNG KHỎE - QUẢN LÝ TIỂU ĐƯỜNG
-- Run AFTER schema.sql in Supabase SQL Editor
-- https://app.supabase.com/project/{project}/sql
--
-- NOTE: This script uses NULL user_id for demo purposes
-- In production, user_id should link to auth.users
-- ============================================

-- ============================================
-- ARTICLES (Blog posts)
-- Columns: id, user_id, title, category, content, image_url, created_at
-- ============================================
INSERT INTO public.articles (user_id, title, category, content, image_url)
VALUES
  (NULL, 'Top 10 thực phẩm kiểm soát đường huyết hiệu quả cho mẹ', 'Dinh dưỡng', 'Lựa chọn thực phẩm có chỉ số GI thấp là chìa khóa để duy trì một cơ thể khỏe mạnh. Bông cải xanh, cá hồi, và quả bơ là những lựa chọn tuyệt vời giúp kiểm soát đường huyết một cách tự nhiên. Đặc biệt, các loại rau xanh lá như rau bina và cải xoăn chứa nhiều chất xơ và magiê, giúp ổn định đường huyết hiệu quả.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600'),
  (NULL, 'Hiểu về chỉ số GI và GL trong thực phẩm hàng ngày', 'Kiến thức', 'Chỉ số GI (Glycemic Index) đo tốc độ thực phẩm làm tăng đường huyết sau khi ăn. Thực phẩm có GI thấp (dưới 55) sẽ giúp đường huyết tăng chậm và ổn định hơn. Trong khi đó, GL (Glycemic Load) tính đến cả lượng carb trong thực phẩm.', 'https://images.unsplash.com/photo-1543332164-6e82f3555182?auto=format&fit=crop&q=80&w=600'),
  (NULL, '5 bài tập yoga cho người bệnh tiểu đường', 'Vận động', 'Yoga là một hình thức tập luyện tuyệt vời cho người bệnh tiểu đường. Các bài tập nhẹ nhàng như Tư thế cây cầu, Tư thế con bướm, và Tư thế em bé giúp cải thiện tuần hoàn máu và giảm stress.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'),
  (NULL, 'Cách đo đường huyết tại nhà đúng kỹ thuật', 'Kiến thức', 'Đo đường huyết đúng cách là rất quan trọng để có kết quả chính xác. Trước tiên, rửa tay sạch bằng xà phòng và lau khô hoàn toàn. Chọn vị trí lấy máu ở cạnh ngón tay, không lấy ở đầu ngón tay.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600'),
  (NULL, 'Gợi ý thực đơn hàng ngày cho người tiểu đường', 'Dinh dưỡng', 'Bữa sáng: Yến mạch với hạt chia và quả mọng. Bữa trưa: Salad cá ngừ với rau xanh và dầu ô liu. Bữa tối: Cá hồi nướng với rau củ STEAM và cơm gạo lứt.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'),
  (NULL, 'Tại sao người tiểu đường cần theo dõi huyết áp?', 'Kiến thức', 'Người bệnh tiểu đường có nguy cơ cao bị tăng huyết áp, dẫn đến các biến chứng tim mạch nguy hiểm. Theo dõi huyết áp thường xuyên giúp phát hiện sớm và kiểm soát kịp thời.', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600'),
  (NULL, 'Cách quản lý stress để kiểm soát đường huyết', 'Vận động', 'Stress là một trong những yếu tố làm tăng đường huyết đáng kể. Khi căng thẳng, cơ thể sản xuất cortisol - hormone làm tăng lượng đường trong máu.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'),
  (NULL, 'Dấu hiệu cảnh báo biến chứng tiểu đường mắt', 'Kiến thức', 'Bệnh võng mạc do tiểu đường là một trong những biến chứng nguy hiểm nhất. Các dấu hiệu cảnh báo sớm bao gồm: mờ mắt tạm thời, nhìn thấy các đốm đen hoặc vệt sáng.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600');

-- ============================================
-- GLUCOSE LOGS (14 days of data)
-- Columns: id, user_id, value, unit, timing, notes, measured_at, created_at, updated_at
-- ============================================
DO $$
DECLARE
  base_date TIMESTAMP;
  glucose_value DECIMAL(4,1);
BEGIN
  FOR i IN 0..13 LOOP
    base_date := CURRENT_TIMESTAMP - (i || ' days')::INTERVAL;

    -- Fasting morning
    glucose_value := (5.0 + (random() * 1.5))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES (NULL, glucose_value, 'mmol/L', 'fasting', 'Đo sau khi thức dậy', base_date + INTERVAL '7 hours');

    -- Before lunch
    glucose_value := (5.5 + (random() * 1.5))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES (NULL, glucose_value, 'mmol/L', 'before_meal', 'Trước bữa trưa 30 phút', base_date + INTERVAL '11 hours 30 minutes');

    -- After lunch
    glucose_value := (6.5 + (random() * 2.5))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES (NULL, glucose_value, 'mmol/L', 'after_meal', 'Sau ăn trưa 2 giờ', base_date + INTERVAL '13 hours 30 minutes');

    -- Before dinner
    glucose_value := (5.8 + (random() * 1.2))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES (NULL, glucose_value, 'mmol/L', 'before_meal', 'Trước bữa tối 30 phút', base_date + INTERVAL '18 hours');

    -- After dinner
    glucose_value := (6.8 + (random() * 2.0))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES (NULL, glucose_value, 'mmol/L', 'after_meal', 'Sau ăn tối 2 giờ', base_date + INTERVAL '20 hours 30 minutes');

    -- Bedtime
    glucose_value := (6.0 + (random() * 1.0))::DECIMAL(4,1);
    INSERT INTO public.glucose_logs (user_id, value, unit, timing, notes, measured_at)
    VALUES (NULL, glucose_value, 'mmol/L', 'bedtime', 'Trước khi đi ngủ', base_date + INTERVAL '21 hours 30 minutes');
  END LOOP;
END $$;

-- ============================================
-- MEALS (Food list with GI levels)
-- Columns: id, user_id, name, gi_level, time, notes, created_at, updated_at
-- ============================================
INSERT INTO public.meals (user_id, name, gi_level, time, notes)
VALUES
  (NULL, 'Yến mạch', 'low', '07:00', 'Giàu chất xơ, tốt cho đường huyết'),
  (NULL, 'Bánh mì đen nguyên cám', 'medium', '07:00', 'Thay thế bánh mì trắng'),
  (NULL, 'Trứng luộc', 'low', '07:00', 'Protein tốt, không ảnh hưởng đường huyết'),
  (NULL, 'Sữa chua không đường', 'low', '07:00', 'Probiotics tốt cho tiêu hóa'),
  (NULL, 'Bông cải xanh', 'low', '12:00', 'Rau xanh giảm đường huyết'),
  (NULL, 'Rau bina', 'low', '12:00', 'Giàu magiê, ổn định đường huyết'),
  (NULL, 'Cà rốt', 'low', '12:00', 'GI thấp dù ngọt'),
  (NULL, 'Đậu bắp', 'low', '12:00', 'Chất xơ cao'),
  (NULL, 'Cá hồi', 'low', '12:00', 'Omega-3 tốt cho tim mạch'),
  (NULL, 'Thịt gà nạc', 'low', '12:00', 'Protein sạch'),
  (NULL, 'Thịt bò nạc', 'medium', '12:00', 'Iron và kẽm'),
  (NULL, 'Tofu', 'low', '12:00', 'Đậu phụ giàu đạo thực vật'),
  (NULL, 'Táo xanh', 'low', '15:00', 'Chất xơ pectin cao'),
  (NULL, 'Bưởi', 'low', '15:00', 'Giảm đường huyết tự nhiên'),
  (NULL, 'Cherry', 'low', '15:00', 'Chống oxy hóa'),
  (NULL, 'Dâu tây', 'low', '15:00', 'Ít carb, nhiều vitamin'),
  (NULL, 'Gạo lứt', 'medium', '12:00', 'Thay thế gạo trắng'),
  (NULL, 'Khoai lang', 'medium', '12:00', 'GI thấp hơn khoai tây'),
  (NULL, 'Hạt óc chó', 'low', '15:00', 'Giàu omega-3'),
  (NULL, 'Hạt chia', 'low', '15:00', 'Chất xơ cao gấp 3 lần'),
  (NULL, 'Hạt hướng dương', 'medium', '15:00', 'Tốt cho tim'),
  (NULL, 'Đậu phộng', 'medium', '15:00', 'Protein thực vật'),
  (NULL, 'Trà xanh', 'low', '08:00', 'Chống oxy hóa'),
  (NULL, 'Cà phê đen không đường', 'medium', '08:00', 'Uống vừa phải'),
  (NULL, 'Nước ép rau củ', 'low', '08:00', 'Không thêm đường'),
  (NULL, 'Trứng', 'low', '07:00', 'Protein hoàn chỉnh'),
  (NULL, 'Bơ', 'low', '07:00', 'Chất béo tốt');

-- ============================================
-- LAB RESULTS (3 months of data)
-- Columns: id, user_id, type, value, unit, recorded_at, notes, created_at, updated_at
-- ============================================
INSERT INTO public.lab_results (user_id, type, value, unit, recorded_at, notes)
VALUES
  -- HbA1c - quarterly (mục tiêu < 7%)
  (NULL, 'hba1c', 6.8, '%', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Tốt - đạt mục tiêu'),
  (NULL, 'hba1c', 6.9, '%', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Gần mục tiêu'),
  (NULL, 'hba1c', 7.1, '%', CURRENT_TIMESTAMP - INTERVAL '75 days', 'Hơi cao, cần chú ý'),
  (NULL, 'hba1c', 7.3, '%', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Vượt mục tiêu'),

  -- Cholesterol - quarterly (mục tiêu < 200 mg/dL)
  (NULL, 'cholesterol', 185, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Bình thường'),
  (NULL, 'cholesterol', 188, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Bình thường'),
  (NULL, 'cholesterol', 195, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '75 days', 'Gần giới hạn'),
  (NULL, 'cholesterol', 202, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Hơi cao'),

  -- Creatinine - quarterly (mục tiêu 0.6-1.2 mg/dL)
  (NULL, 'creatinine', 1.0, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Bình thường'),
  (NULL, 'creatinine', 0.95, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Bình thường'),
  (NULL, 'creatinine', 1.05, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '75 days', 'Bình thường'),
  (NULL, 'creatinine', 1.1, 'mg/dL', CURRENT_TIMESTAMP - INTERVAL '105 days', 'Bình thường'),

  -- Other - blood glucose fasting
  (NULL, 'other', 5.4, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '7 days', 'Đường huyết đói tốt'),
  (NULL, 'other', 5.6, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Bình thường'),
  (NULL, 'other', 5.8, 'mmol/L', CURRENT_TIMESTAMP - INTERVAL '60 days', 'Bình thường');

-- ============================================
-- MEDICATIONS
-- Columns: id, user_id, name, dosage, instructions, schedule_time, frequency, created_at, updated_at
-- ============================================
INSERT INTO public.medications (user_id, name, dosage, instructions, schedule_time, frequency)
VALUES
  (NULL, 'Metformin 500mg', '500mg', 'Uống sau bữa ăn sáng với nhiều nước', '07:00', 'daily'),
  (NULL, 'Gliclazide 80mg', '80mg', 'Uống trước bữa ăn sáng 30 phút', '07:00', 'daily'),
  (NULL, 'Metformin 500mg', '500mg', 'Uống sau bữa ăn tối', '19:00', 'daily'),
  (NULL, 'Aspirin 81mg', '81mg', 'Uống sau bữa ăn tối', '19:00', 'daily'),
  (NULL, 'Atorvastatin 20mg', '20mg', 'Uống sau bữa tối', '20:00', 'daily');

-- ============================================
-- MEDICATION LOGS
-- Columns: id, medication_id, user_id, taken_at, status, notes, created_at, updated_at
-- ============================================
DO $$
DECLARE
  med_record RECORD;
  log_date TIMESTAMP;
BEGIN
  FOR med_record IN SELECT id, name, schedule_time FROM public.medications LOOP
    FOR i IN 0..6 LOOP
      log_date := CURRENT_TIMESTAMP - (i || ' days')::INTERVAL + (med_record.schedule_time || ' hours')::INTERVAL;
      IF random() > 0.1 THEN
        INSERT INTO public.medication_logs (medication_id, user_id, taken_at, status, notes)
        VALUES (med_record.id, NULL, log_date, 'taken', NULL);
      ELSE
        INSERT INTO public.medication_logs (medication_id, user_id, taken_at, status, notes)
        VALUES (med_record.id, NULL, log_date, 'skipped', 'Quên không uống');
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- NOTIFICATION SCHEDULES
-- Columns: id, user_id, medication_id, scheduled_time, is_active, last_sent_at, created_at
-- Note: scheduled_time is TIMESTAMP WITH TIME ZONE
-- ============================================
INSERT INTO public.notification_schedules (user_id, medication_id, scheduled_time, is_active)
SELECT NULL, id, CURRENT_DATE + (schedule_time || ' hours')::INTERVAL, true
FROM public.medications;

-- ============================================
-- CONVERSATIONS & MESSAGES
-- Conversations columns: id, user_id, created_at
-- Messages columns: id, conversation_id, role, content, created_at
-- ============================================
WITH first_conv AS (
  INSERT INTO public.conversations (user_id, created_at)
  VALUES (NULL, CURRENT_TIMESTAMP - INTERVAL '7 days')
  RETURNING id
)
INSERT INTO public.messages (conversation_id, role, content, created_at)
VALUES
  ((SELECT id FROM first_conv), 'user', 'Chào bác sĩ, tôi muốn hỏi về chế độ ăn cho người tiểu đường type 2', CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ((SELECT id FROM first_conv), 'assistant', 'Chào bạn! Rất vui được tư vấn. Điều quan trọng nhất là lựa chọn thực phẩm có chỉ số GI thấp, chia nhỏ bữa ăn và tránh thực phẩm nhiều đường.', CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '5 minutes'),
  ((SELECT id FROM first_conv), 'user', 'Vâng, xin hãy gợi ý cho tôi bữa sáng phù hợp', CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM first_conv), 'assistant', 'Bữa sáng cho người tiểu đường nên bao gồm: Yến mạch (GI thấp, giàu chất xơ), trứng luộc (protein), sữa chua không đường, và một quả táo hoặc quả bưởi. Tránh bánh mì trắng, nước ngọt và các loại ngũ cốc có đường.', CURRENT_TIMESTAMP - INTERVAL '6 days' + INTERVAL '3 minutes');

WITH second_conv AS (
  INSERT INTO public.conversations (user_id, created_at)
  VALUES (NULL, CURRENT_TIMESTAMP - INTERVAL '3 days')
  RETURNING id
)
INSERT INTO public.messages (conversation_id, role, content, created_at)
VALUES
  ((SELECT id FROM second_conv), 'user', 'Tôi nên tập thể dục như thế nào để kiểm soát đường huyết?', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM second_conv), 'assistant', 'Người tiểu đường nên tập thể dục 30-45 phút mỗi ngày, ít nhất 5 ngày/tuần. Các bài tập phù hợp bao gồm: Đi bộ nhanh, bơi lội, yoga, hoặc đạp xe nhẹ nhàng. Tránh tập quá sức và nhớ kiểm tra đường huyết trước và sau khi tập.', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '4 minutes');

-- ============================================
-- MEMORIAL QUOTES
-- Columns: id, user_id, content, author, created_at
-- ============================================
INSERT INTO public.memorial_quotes (user_id, content, author)
VALUES
  (NULL, 'Cuộc sống không phải là việc chờ đợi bão tố đi qua, mà là học cách nhảy múa dưới mưa.', 'Ngạn'),
  (NULL, 'Mẹ luôn nói: Con là món quà quý nhất mà cuộc sống đã ban tặng.', 'Gia đình'),
  (NULL, 'Hãy sống như hôm nay là ngày cuối cùng, và yêu thương như chưa từng được yêu thương.', 'Unknown'),
  (NULL, 'Sức khỏe là sự giàu có thực sự, không phải vàng hay bạc.', 'Maggie'),
  (NULL, 'Hãy yêu thương bản thân trước khi yêu thương người khác.', 'Self Care');

-- ============================================
-- MEMORIAL STORIES
-- Columns: id, user_id, title, content, date, created_at
-- ============================================
INSERT INTO public.memorial_stories (user_id, title, content, date)
VALUES
  (NULL, 'Kỷ niệm đầu tiên', 'Đó là một buổi chiều mùa hè năm 1995, khi tôi còn nhỏ. Mẹ dẫn tôi đi chơi công viên lần đầu tiên. Tôi vẫn nhớ mùi hoa sữa và nụ cười của mẹ khi tôi chạy quanh hồ.', '1995-06-15'),
  (NULL, 'Bài học về sức khỏe', 'Mẹ luôn dạy tôi rằng sức khỏe là tài sản quý giá nhất. Bây giờ, sau nhiều năm, tôi mới thực sự hiểu điều đó. Hãy chăm sóc bản thân như cách mẹ đã chăm sóc cả gia đình.', '2010-03-20'),
  (NULL, 'Ngày sinh nhật cuối cùng', 'Ngày sinh nhật cuối cùng của mẹ, cả gia đình sum họp đầy đủ. Không ai biết đó sẽ là kỷ niệm cuối cùng. Nhưng tôi biết ơn vì đã có nó.', '2020-08-10'),
  (NULL, 'Mùa hè yêu thương', 'Những ngày hè cùng nhau nấu cơm, trò chuyện và chia sẻ. Đó là những khoảnh khắc bình dị nhưng quý giá nhất trong cuộc sống.', '2019-07-15');

-- ============================================
-- MEMORIAL PHOTOS
-- Columns: id, user_id, title, description, image_url, date, created_at
-- ============================================
INSERT INTO public.memorial_photos (user_id, title, description, image_url, date)
VALUES
  (NULL, 'Gia đình hạnh phúc', 'Ảnh chụp cuối cùng cả nhà sum họp', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600', '2020-08-10'),
  (NULL, 'Kỷ niệm mùa xuân', 'Khu vườn nhà mẹ vào mùa hoa anh đào', 'https://images.unsplash.com/photo-1522758971460-1d21eed4b6df?auto=format&fit=crop&q=80&w=600', '2019-04-05'),
  (NULL, 'Buổi trưa yêu thương', 'Bữa trưa cuối tuần cùng gia đình', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=600', '2020-06-20');

-- ============================================
-- HEALTH EVENTS (Nhật ký sức khỏe)
-- Columns: id, user_id, event_type, title, event_date, description, created_at, updated_at
-- ============================================
INSERT INTO public.health_events (user_id, event_type, title, event_date, description)
VALUES
  (NULL, 'Biến cố', 'Cảm cúm nhẹ & Sốt', '2024-05-08', 'Có hiện tượng nhức đầu, chảy mũi. Đã đi khám và được kê thuốc súc họng.'),
  (NULL, 'Theo dõi', 'Huyết áp ổn định', '2024-05-11', 'Huyết áp duy trì mức 115/75 mmHg. Không có hiện tượng phù chân.'),
  (NULL, 'Theo dõi', 'Đường huyết kiểm soát tốt', '2024-05-15', 'HbA1c về mức 6.8%. Tiếp tục duy trì chế độ ăn hiện tại.'),
  (NULL, 'Biến cố', 'Đau chân trái', '2024-05-18', 'Có cảm giác tê bì ngón chân trái. Đi khám bác sĩ nói cần kiểm tra thêm.'),
  (NULL, 'Theo dõi', 'Tập thể dục đều đặn', '2024-05-20', 'Đi bộ 30 phút mỗi ngày trong tuần. Cảm thấy khỏe hơn.'),
  (NULL, 'Theo dõi', 'Kiểm tra mắt định kỳ', '2024-05-22', 'Khám mắt tại BV Mắt TW. Kết quả bình thường, không có biến chứng.'),
  (NULL, 'Biến cố', 'Nhức đầu sau ăn', '2024-05-25', 'Bữa trưa ăn nhiều tinh bột, sau đó bị nhức đầu. Cần điều chỉnh lại bữa ăn.'),
  (NULL, 'Theo dõi', 'Uống thuốc đều đặn', '2024-05-27', 'Tuần này nhớ uống thuốc đầy đủ. Không quên lần nào.');

-- ============================================
-- ACTIVITY SCHEDULES (Lịch tập luyện)
-- Columns: id, user_id, activity_name, scheduled_date, scheduled_time, duration_minutes, calories_burned, completed, notes, created_at, updated_at
-- ============================================
INSERT INTO public.activity_schedules (user_id, activity_name, scheduled_date, scheduled_time, duration_minutes, calories_burned, completed, notes)
VALUES
  (NULL, 'Đi bộ sáng', '2024-05-20', '06:00', 30, 150, true, 'Đi bộ quanh hồ'),
  (NULL, 'Đi bộ sáng', '2024-05-21', '06:00', 30, 150, true, 'Đi bộ quanh hồ'),
  (NULL, 'Đi bộ sáng', '2024-05-22', '06:00', 30, 150, true, 'Đi bộ quanh công viên'),
  (NULL, 'Yoga nhẹ', '2024-05-22', '19:00', 45, 120, true, 'Tư thế cây cầu, con bướm'),
  (NULL, 'Đi bộ sáng', '2024-05-23', '06:00', 30, 160, true, 'Tăng tốc độ đi'),
  (NULL, 'Bơi lội', '2024-05-24', '09:00', 45, 300, false, 'Trời mưa nên bỏ'),
  (NULL, 'Đi bộ sáng', '2024-05-24', '06:00', 30, 150, true, 'Đi bộ quanh hồ'),
  (NULL, 'Yoga nhẹ', '2024-05-25', '19:00', 45, 130, true, 'Thiền định + yoga'),
  (NULL, 'Đi bộ sáng', '2024-05-26', '06:00', 35, 180, true, 'Chủ nhật đi bộ xa hơn'),
  (NULL, 'Đạp xe', '2024-05-27', '17:00', 40, 250, true, 'Đạp xe quanh hồ'),
  (NULL, 'Đi bộ sáng', '2024-05-28', '06:00', 30, 150, true, 'Đi bộ buổi sáng'),
  (NULL, 'Yoga nhẹ', '2024-05-28', '19:00', 45, 120, true, 'Kéo giãn cơ'),
  (NULL, 'Đi bộ sáng', '2024-05-29', '06:00', 30, 150, true, 'Đi bộ quanh hồ'),
  (NULL, 'Bơi lội', '2024-05-30', '09:00', 45, 300, true, 'Bơi 10 vòng');

-- ============================================
-- BODY METRICS (Chỉ số cơ thể)
-- Columns: id, user_id, record_date, weight_kg, blood_pressure_systolic, blood_pressure_diastolic, notes, created_at, updated_at
-- ============================================
INSERT INTO public.body_metrics (user_id, record_date, weight_kg, blood_pressure_systolic, blood_pressure_diastolic, notes)
VALUES
  (NULL, '2024-05-01', 68.5, 120, 80, 'Cân nặng ổn định'),
  (NULL, '2024-05-05', 68.3, 118, 78, 'Huyết áp tốt'),
  (NULL, '2024-05-08', 68.0, 122, 82, 'Sau cảm cúm, cân giảm nhẹ'),
  (NULL, '2024-05-10', 68.2, 120, 80, 'Bình thường'),
  (NULL, '2024-05-12', 68.0, 115, 75, 'Tốt - kiểm soát tốt'),
  (NULL, '2024-05-15', 67.8, 118, 78, 'Bắt đầu giảm cân nhẹ'),
  (NULL, '2024-05-18', 67.5, 120, 80, 'Tiếp tục giảm'),
  (NULL, '2024-05-20', 67.3, 118, 76, 'Tập thể dục đều đặn'),
  (NULL, '2024-05-22', 67.0, 115, 75, 'Mục tiêu đạt được'),
  (NULL, '2024-05-25', 67.2, 120, 80, 'Duу trì cân nặng'),
  (NULL, '2024-05-28', 67.0, 118, 78, 'Ổn định'),
  (NULL, '2024-05-30', 66.8, 115, 74, 'Tốt - tiếp tục duy trì');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 'Mock data inserted successfully!
- articles: 8 posts
- glucose_logs: ~80 readings
- meals: 27 items
- lab_results: 15 results
- medications: 5 meds
- medication_logs: ~35 logs
- notification_schedules: 5 schedules
- conversations: 2
- messages: 6
- memorial_quotes: 5
- memorial_stories: 4
- memorial_photos: 3
- health_events: 8 events
- activity_schedules: 15 schedules
- body_metrics: 12 records' as status;