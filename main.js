function analyzeData() {
  // 获取表单数据
  const cost1 = parseFloat(document.getElementById("cost1").value);
  const impressions1 = parseFloat(
    document.getElementById("impressions1").value
  );
  const clicks1 = parseFloat(document.getElementById("clicks1").value);
  const conversions1 = parseFloat(
    document.getElementById("conversions1").value
  );

  const cost2 = parseFloat(document.getElementById("cost2").value);
  const impressions2 = parseFloat(
    document.getElementById("impressions2").value
  );
  const clicks2 = parseFloat(document.getElementById("clicks2").value);
  const conversions2 = parseFloat(
    document.getElementById("conversions2").value
  );

  const threshold = parseFloat(document.getElementById("threshold").value);

  // 計算指標
  function calculateMetrics(cost, impressions, clicks, conversions) {
    const ctr = (clicks / impressions) * 100;
    const cpc = cost / clicks;
    const cpm = (cost / impressions) * 1000;
    const cpa = cost / conversions;
    const conversionRate = (conversions / clicks) * 100;
    return { ctr, cpc, cpm, cpa, conversionRate };
  }

  const metrics1 = calculateMetrics(cost1, impressions1, clicks1, conversions1);
  const metrics2 = calculateMetrics(cost2, impressions2, clicks2, conversions2);

  // 計算變化
  function calculateChange(oldValue, newValue) {
    return ((newValue - oldValue) / oldValue) * 100;
  }

  const ctrChange = calculateChange(metrics1.ctr, metrics2.ctr);
  const cpcChange = calculateChange(metrics1.cpc, metrics2.cpc);
  const cpmChange = calculateChange(metrics1.cpm, metrics2.cpm);
  const cpaChange = calculateChange(metrics1.cpa, metrics2.cpa);
  const conversionRateChange = calculateChange(
    metrics1.conversionRate,
    metrics2.conversionRate
  );

  // 印出測試訊息
  console.log("前期指標:", metrics1);
  console.log("本期指標:", metrics2);
  console.log("變動百分比:", {
    ctrChange,
    cpcChange,
    cpmChange,
    cpaChange,
    conversionRateChange
  });

  // 判断變化是否超過警戒，並標記红色
  function formatChange(value, threshold) {
    const color = Math.abs(value) >= threshold ? "red" : "black";
    return `<span style="color: ${color};">${value.toFixed(2)}%</span>`;
  }

  // 顯示结果
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
      <h2>分析结果</h2>
        <h3>前期與本期指標對比</h3>
        <table border="1">
            <thead>
                <tr>
                    <th>指標類别</th>
                    <th>指標</th>
                    <th>前期</th>
                    <th>本期</th>
                    <th>變化百分比</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="3">廣告展示成效與投放成本評估</td>
                    <td>CPM</td>
                    <td>$${metrics1.cpm.toFixed(2)}</td>
                    <td>$${metrics2.cpm.toFixed(2)}</td>
                    <td>${formatChange(cpmChange, threshold)}</td>
                </tr>
                <tr>
                    <td>CPC</td>
                    <td>$${metrics1.cpc.toFixed(2)}</td>
                    <td>$${metrics2.cpc.toFixed(2)}</td>
                    <td>${formatChange(cpcChange, threshold)}</td>
                </tr>
                <tr>
                    <td>點擊率</td>
                    <td>${metrics1.ctr.toFixed(2)}%</td>
                    <td>${metrics2.ctr.toFixed(2)}%</td>
                    <td>${formatChange(ctrChange, threshold)}</td>
                </tr>
                <tr>
                    <td rowspan="2">轉換成效與成本評估</td>
                    <td>CPA</td>
                    <td>$${metrics1.cpa.toFixed(2)}</td>
                    <td>$${metrics2.cpa.toFixed(2)}</td>
                    <td>${formatChange(cpaChange, threshold)}</td>
                </tr>
                <tr>
                    <td>轉換率</td>
                    <td>${metrics1.conversionRate.toFixed(2)}%</td>
                    <td>${metrics2.conversionRate.toFixed(2)}%</td>
                    <td>${formatChange(conversionRateChange, threshold)}</td>
                </tr>
            </tbody>
        </table>

        <h3>摘要</h3>
        <p>${generateAdvancedRecommendations(
          cpmChange,
          cpcChange,
          cpaChange,
          conversionRateChange,
          ctrChange,
          threshold
        )}</p>
    `;
}

function generateAdvancedRecommendations(
  cpmChange,
  cpcChange,
  cpaChange,
  conversionRateChange,
  ctrChange,
  threshold
) {
  let recommendations = "";

  console.log("Threshold:", threshold);
  console.log("CPM Change:", cpmChange);
  console.log("CPC Change:", cpcChange);
  console.log("CTR Change:", ctrChange);
  console.log("Conversion Rate Change:", conversionRateChange);

  if (cpaChange < 0) {
    // CPA下降，转換成效良好
    recommendations += `轉換成效良好：CPA下降 ${cpaChange.toFixed(2)}%。<br>\n`;

    // 提供其他指标的变化，并提醒是否有进一步优化空间
    if (cpmChange < 0) recommendations += "CPM下降，廣告展示成本降低。<br>\n";
    if (cpcChange < 0) recommendations += "CPC下降，點擊成本持續優化。<br>\n";
    if (ctrChange > 0) recommendations += "CTR上升，廣告吸引力提升。<br>\n";
    if (conversionRateChange > 0)
      recommendations += "轉換率上升，精準度或頁面流程效率提升。<br>\n";
  } else if (cpaChange > threshold) {
    // CPA上升，分析其他相关指标的变化
    recommendations += `轉換成效大幅下滑：CPA上升 ${cpaChange.toFixed(
      2
    )}%，超過警戒值，建議進一步檢查其他指標。<br>\n`;

    if (conversionRateChange <= -threshold) {
      recommendations +=
        "轉換率下滑超過警戒值，可能需要檢查轉換流程，優化網站體驗，或檢視相關結帳流程。<br>\n";
    }
    if (cpcChange >= threshold) {
      recommendations +=
        "CPC上升超過警戒值，競價成本增加，建議檢查競爭環境、廣告競爭力等。<br>\n";
    }
    if (cpmChange >= threshold) {
      recommendations +=
        "CPM上升超過警戒值，可能意味展示成本上升，建議檢查競爭環境(尤其是節慶或新競品加入競爭)。<br>\n";
    }
    if (ctrChange <= -threshold) {
      recommendations +=
        "CTR下滑超過警戒值，建議检查廣告素材的吸引力或受眾群體是否合適。<br>\n";
    }
    if (ctrChange >= threshold) {
      recommendations +=
        "CTR上升超過警戒值，可能意味着廣告吸引到错误的受眾群體，建議检查廣告素材的切角和受眾定位。<br>\n";
    }
  } else {
    // CPA變化在警戒值内，檢查其他指標變化
    if (
      cpcChange >= threshold ||
      ctrChange <= -threshold ||
      cpmChange >= threshold
    ) {
      recommendations += `轉換成效稳定：CPA變化為 ${cpaChange.toFixed(
        2
      )}%，在安全警戒值内，但仍可留意以下變動較劇烈指標。<br>\n`;

      if (cpcChange >= threshold)
        recommendations += "CPC上升超過警戒值，建議留意競價環境。<br>\n";
      if (ctrChange <= -threshold)
        recommendations +=
          "CTR下滑超過警戒值，建議檢查廣告素材的吸引力及受眾群體是否合適(素材or受眾漸漸開始疲乏，可能需要換素材或換受眾)。<br>\n";
      if (cpmChange >= threshold)
        recommendations +=
          "CPM上升超過警戒值，可能意味展示成本上升中，建議留意競價環境或是否有新競品。<br>\n";
    } else {
      recommendations += `轉換成效稳定：CPA變化為 ${cpaChange.toFixed(
        2
      )}%，在安全警戒值内，且各項指標大致穩定!<br>\n`;
    }
  }

  return recommendations;
}
