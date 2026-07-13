import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";

import { Assignment } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function LogInteraction() {
  const initialForm = {
    hcp_id: "",
    interaction_type: "Visit",
    duration_minutes: 30,
    raw_notes: "",
    products_discussed: "",
    follow_up_date: null,
  };

  const [hcps, setHcps] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState("");

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    loadHCPs();
  }, []);

  const loadHCPs = async () => {
    try {
      const res = await api.get("/hcps");

      setHcps(res.data);

      if (res.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          hcp_id: res.data[0].id,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitInteraction = async () => {
    try {
      setLoading(true);

      const payload = {
        hcp_id: Number(form.hcp_id),

        interaction_type: form.interaction_type,

        duration_minutes: Number(form.duration_minutes),

        raw_notes: form.raw_notes,

        products_discussed: form.products_discussed
          ? form.products_discussed
              .split(",")
              .map((item) => item.trim())
          : [],

        follow_up_date: form.follow_up_date
          ? form.follow_up_date.toISOString()
          : null,
      };

      const res = await api.post("/interactions", payload);

      setSummary(
        res.data.ai_summary ||
          `Interaction with HCP ID ${payload.hcp_id} logged successfully.

Products Discussed:
${payload.products_discussed.join(", ") || "None"}

Recommended Next Action:
Schedule follow-up meeting.`
      );

      setMessage("Interaction logged successfully ✅");
      setSeverity("success");
      setOpen(true);

      setForm(initialForm);
    } catch (error) {
      console.log(error);

      setMessage("Error logging interaction ❌");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <Typography variant="h4" fontWeight="700" mb={4}>
          Log Interaction
        </Typography>

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ padding: "35px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 4,
              }}
            >
              <Assignment color="primary" fontSize="large" />

              <Typography variant="h6" fontWeight="700">
                Interaction Details
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Select HCP"
                  name="hcp_id"
                  value={form.hcp_id}
                  onChange={handleChange}
                >
                  {hcps.map((hcp) => (
                    <MenuItem key={hcp.id} value={hcp.id}>
                      {hcp.full_name} ({hcp.specialty})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Interaction Type"
                  name="interaction_type"
                  value={form.interaction_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Visit">Visit</MenuItem>
                  <MenuItem value="Call">Call</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="In-person">In-person</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (Minutes)"
                  name="duration_minutes"
                  value={form.duration_minutes}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Products Discussed"
                  name="products_discussed"
                  placeholder="Paracetamol, Vitamin C"
                  value={form.products_discussed}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Interaction Notes"
                  name="raw_notes"
                  value={form.raw_notes}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Follow-up Date"
                  value={form.follow_up_date}
                  format="DD/MM/YYYY"
                  onChange={(newValue) =>
                    setForm({
                      ...form,
                      follow_up_date: newValue,
                    })
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={submitInteraction}
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {loading ? "Submitting..." : "Submit Interaction"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {summary && (
          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
              >
                🤖 AI Generated Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                whiteSpace="pre-line"
                lineHeight={1.8}
              >
                {summary}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        >
          <Alert severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default LogInteraction;